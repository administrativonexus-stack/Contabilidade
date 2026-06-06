-- ============================================================
-- NEXUS CONTABILIDADE — Schema completo
-- Cole e execute no Supabase SQL Editor (uma única vez)
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('super_admin','admin','staff','client');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE ticket_status AS ENUM ('open','in_progress','waiting_client','completed','cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE document_category AS ENUM ('tax','payroll','contract','certificate','report','other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE announcement_category AS ENUM ('general','tax_update','compliance','deadline','company_news');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auth_user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  role            user_role NOT NULL DEFAULT 'client',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.companies (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name        TEXT NOT NULL,
  trade_name          TEXT,
  cnpj                TEXT,
  email               TEXT,
  phone               TEXT,
  address             TEXT,
  city                TEXT,
  state               TEXT,
  zip_code            TEXT,
  responsible_person  TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_companies (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  company_id  UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

CREATE TABLE IF NOT EXISTS public.documents (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id   UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  category     document_category NOT NULL DEFAULT 'other',
  file_name    TEXT NOT NULL,
  file_path    TEXT NOT NULL,
  file_size    BIGINT NOT NULL DEFAULT 0,
  mime_type    TEXT NOT NULL DEFAULT 'application/octet-stream',
  uploaded_by  UUID REFERENCES public.users(id) NOT NULL,
  deleted_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.document_downloads (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id    UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  user_id        UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  downloaded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tickets (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id   UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  created_by   UUID REFERENCES public.users(id) NOT NULL,
  assigned_to  UUID REFERENCES public.users(id),
  subject      TEXT NOT NULL,
  description  TEXT NOT NULL,
  status       ticket_status NOT NULL DEFAULT 'open',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id   UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id   UUID REFERENCES public.users(id) NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ticket_attachments (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id    UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  file_name    TEXT NOT NULL,
  file_path    TEXT NOT NULL,
  file_size    BIGINT NOT NULL DEFAULT 0,
  uploaded_by  UUID REFERENCES public.users(id) NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title        TEXT NOT NULL,
  summary      TEXT NOT NULL,
  content      TEXT NOT NULL,
  category     announcement_category NOT NULL DEFAULT 'general',
  published    BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by   UUID REFERENCES public.users(id) NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.announcement_companies (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  announcement_id  UUID REFERENCES public.announcements(id) ON DELETE CASCADE NOT NULL,
  company_id       UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(announcement_id, company_id)
);

CREATE TABLE IF NOT EXISTS public.lead_submissions (
  id                 UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name               TEXT NOT NULL,
  company_name       TEXT,
  email              TEXT NOT NULL,
  phone              TEXT,
  source             TEXT,
  calculator_type    TEXT,
  estimated_savings  NUMERIC,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id      UUID REFERENCES public.users(id),
  action       TEXT NOT NULL,
  entity_type  TEXT NOT NULL,
  entity_id    UUID,
  metadata     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- RLS — Row Level Security
-- ============================================================

ALTER TABLE public.users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_companies        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_downloads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_attachments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_submissions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications         ENABLE ROW LEVEL SECURITY;

-- Helper functions (SECURITY DEFINER para bypassar RLS)
CREATE OR REPLACE FUNCTION public.get_user_id()
RETURNS UUID LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT id FROM public.users WHERE auth_user_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM public.users WHERE auth_user_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.get_user_company_ids()
RETURNS SETOF UUID LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT company_id FROM public.user_companies WHERE user_id = public.get_user_id()
$$;

-- users
CREATE POLICY "users_select" ON public.users FOR SELECT USING (
  auth_user_id = auth.uid() OR public.get_user_role() IN ('admin','super_admin','staff')
);
CREATE POLICY "users_update" ON public.users FOR UPDATE USING (auth_user_id = auth.uid());
CREATE POLICY "users_insert" ON public.users FOR INSERT WITH CHECK (true);

-- companies
CREATE POLICY "companies_select" ON public.companies FOR SELECT USING (
  id = ANY(SELECT * FROM public.get_user_company_ids()) OR
  public.get_user_role() IN ('admin','super_admin','staff')
);
CREATE POLICY "companies_update" ON public.companies FOR UPDATE USING (
  public.get_user_role() IN ('admin','super_admin')
);
CREATE POLICY "companies_insert" ON public.companies FOR INSERT WITH CHECK (
  public.get_user_role() IN ('admin','super_admin')
);

-- user_companies
CREATE POLICY "user_companies_select" ON public.user_companies FOR SELECT USING (
  user_id = public.get_user_id() OR public.get_user_role() IN ('admin','super_admin','staff')
);
CREATE POLICY "user_companies_insert" ON public.user_companies FOR INSERT WITH CHECK (
  public.get_user_role() IN ('admin','super_admin')
);

-- documents
CREATE POLICY "documents_select" ON public.documents FOR SELECT USING (
  (company_id = ANY(SELECT * FROM public.get_user_company_ids()) AND deleted_at IS NULL) OR
  public.get_user_role() IN ('admin','super_admin','staff')
);
CREATE POLICY "documents_insert" ON public.documents FOR INSERT WITH CHECK (
  public.get_user_role() IN ('admin','super_admin','staff')
);
CREATE POLICY "documents_update" ON public.documents FOR UPDATE USING (
  public.get_user_role() IN ('admin','super_admin','staff')
);

-- document_downloads
CREATE POLICY "doc_downloads_insert" ON public.document_downloads FOR INSERT WITH CHECK (
  user_id = public.get_user_id()
);
CREATE POLICY "doc_downloads_select" ON public.document_downloads FOR SELECT USING (
  user_id = public.get_user_id() OR public.get_user_role() IN ('admin','super_admin','staff')
);

-- tickets
CREATE POLICY "tickets_select" ON public.tickets FOR SELECT USING (
  company_id = ANY(SELECT * FROM public.get_user_company_ids()) OR
  public.get_user_role() IN ('admin','super_admin','staff')
);
CREATE POLICY "tickets_insert" ON public.tickets FOR INSERT WITH CHECK (
  company_id = ANY(SELECT * FROM public.get_user_company_ids())
);
CREATE POLICY "tickets_update" ON public.tickets FOR UPDATE USING (
  public.get_user_role() IN ('admin','super_admin','staff')
);

-- ticket_messages
CREATE POLICY "ticket_messages_select" ON public.ticket_messages FOR SELECT USING (
  ticket_id IN (SELECT id FROM public.tickets WHERE company_id = ANY(SELECT * FROM public.get_user_company_ids())) OR
  public.get_user_role() IN ('admin','super_admin','staff')
);
CREATE POLICY "ticket_messages_insert" ON public.ticket_messages FOR INSERT WITH CHECK (
  sender_id = public.get_user_id() AND (
    ticket_id IN (SELECT id FROM public.tickets WHERE company_id = ANY(SELECT * FROM public.get_user_company_ids())) OR
    public.get_user_role() IN ('admin','super_admin','staff')
  )
);

-- ticket_attachments
CREATE POLICY "ticket_attachments_select" ON public.ticket_attachments FOR SELECT USING (
  ticket_id IN (SELECT id FROM public.tickets WHERE company_id = ANY(SELECT * FROM public.get_user_company_ids())) OR
  public.get_user_role() IN ('admin','super_admin','staff')
);

-- announcements
CREATE POLICY "announcements_select" ON public.announcements FOR SELECT USING (
  (published = true AND (
    id NOT IN (SELECT announcement_id FROM public.announcement_companies) OR
    id IN (SELECT ac.announcement_id FROM public.announcement_companies ac WHERE ac.company_id = ANY(SELECT * FROM public.get_user_company_ids()))
  )) OR
  public.get_user_role() IN ('admin','super_admin','staff')
);
CREATE POLICY "announcements_insert" ON public.announcements FOR INSERT WITH CHECK (
  public.get_user_role() IN ('admin','super_admin','staff')
);
CREATE POLICY "announcements_update" ON public.announcements FOR UPDATE USING (
  public.get_user_role() IN ('admin','super_admin','staff')
);

-- announcement_companies
CREATE POLICY "announcement_companies_select" ON public.announcement_companies FOR SELECT USING (
  company_id = ANY(SELECT * FROM public.get_user_company_ids()) OR
  public.get_user_role() IN ('admin','super_admin','staff')
);
CREATE POLICY "announcement_companies_insert" ON public.announcement_companies FOR INSERT WITH CHECK (
  public.get_user_role() IN ('admin','super_admin','staff')
);

-- lead_submissions (qualquer um pode inserir, só admin lê)
CREATE POLICY "leads_insert" ON public.lead_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_select" ON public.lead_submissions FOR SELECT USING (
  public.get_user_role() IN ('admin','super_admin','staff')
);

-- audit_logs
CREATE POLICY "audit_logs_insert" ON public.audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "audit_logs_select" ON public.audit_logs FOR SELECT USING (
  public.get_user_role() IN ('admin','super_admin')
);

-- notifications
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT USING (user_id = public.get_user_id());
CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE USING (user_id = public.get_user_id());
CREATE POLICY "notifications_insert" ON public.notifications FOR INSERT WITH CHECK (
  public.get_user_role() IN ('admin','super_admin','staff')
);

-- ============================================================
-- STORAGE — Bucket de documentos
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents', 'documents', false, 26214400,
  ARRAY['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/png','image/jpeg','application/zip']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "storage_select" ON storage.objects FOR SELECT USING (
  bucket_id = 'documents' AND (
    public.get_user_role() IN ('admin','super_admin','staff') OR
    (storage.foldername(name))[1]::uuid = ANY(SELECT * FROM public.get_user_company_ids())
  )
);
CREATE POLICY "storage_insert" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND public.get_user_role() IN ('admin','super_admin','staff')
);
CREATE POLICY "storage_delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'documents' AND public.get_user_role() IN ('admin','super_admin','staff')
);


-- ============================================================
-- FEES TABLE (Honorários)
-- ============================================================

CREATE TYPE fee_status AS ENUM ('pending', 'paid', 'overdue');

CREATE TABLE public.fees (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  description text NOT NULL,
  period      date NOT NULL,
  amount      numeric(12,2) NOT NULL,
  due_date    date NOT NULL,
  status      fee_status NOT NULL DEFAULT 'pending',
  boleto_url  text,
  invoice_url text,
  receipt_url text,
  paid_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "client_read_own_fees" ON public.fees
  FOR SELECT USING (
    company_id = ANY(public.get_user_company_ids())
    OR public.get_user_role() IN ('admin', 'super_admin', 'staff')
  );

CREATE POLICY "client_update_own_fees" ON public.fees
  FOR UPDATE USING (company_id = ANY(public.get_user_company_ids()))
  WITH CHECK (company_id = ANY(public.get_user_company_ids()));

CREATE POLICY "admin_insert_fees" ON public.fees
  FOR INSERT WITH CHECK (
    public.get_user_role() IN ('admin', 'super_admin', 'staff')
  );
