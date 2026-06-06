export type UserRole = "super_admin" | "admin" | "staff" | "client";
export type PlanStatus = "active" | "inactive" | "archived";
export type BillingCycle = "monthly" | "quarterly" | "semiannual" | "annual";
export type SubscriptionStatus = "trial" | "active" | "past_due" | "suspended" | "cancelled" | "expired";
export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "cancelled" | "refunded";
export type FinPaymentMethod = "pix" | "boleto" | "credit_card" | "debit_card" | "bank_transfer" | "manual";
export type FinPaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";
export type CollectionStatus = "current" | "reminder_sent" | "first_notice" | "second_notice" | "suspension_warning" | "suspended" | "resolved";
export type CrmLeadStatus = "new" | "contacted" | "qualified" | "proposal_sent" | "negotiation" | "won" | "lost";
export type CrmOpportunityStage = "new_lead" | "initial_contact" | "discovery" | "proposal_sent" | "negotiation" | "won" | "lost";
export type CrmProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";
export type CrmContractStatus = "draft" | "pending_signature" | "signed" | "cancelled" | "expired";
export type CrmActivityType = "call" | "meeting" | "email" | "follow_up" | "proposal_review" | "internal_task";
export type CrmTaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type CrmHealthStatus = "excellent" | "healthy" | "attention" | "critical";
export type TicketStatus = "open" | "in_progress" | "waiting_client" | "completed" | "cancelled";
export type DocumentCategory = "tax" | "payroll" | "contract" | "certificate" | "report" | "other" | "accounting" | "financial" | "legal";
export type AnnouncementCategory = "general" | "tax_update" | "compliance" | "deadline" | "company_news";
export type FeeStatus = "pending" | "paid" | "overdue";
export type DocumentWorkflowStatus = "submitted" | "under_review" | "pending_information" | "approved" | "rejected" | "archived";
export type ActionPriority = "low" | "medium" | "high" | "urgent";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_user_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          role: UserRole;
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          auth_user_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          role?: UserRole;
          is_active?: boolean;
          last_login_at?: string | null;
        };
        Update: {
          auth_user_id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          role?: UserRole;
          is_active?: boolean;
          last_login_at?: string | null;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          id: string;
          company_name: string;
          trade_name: string | null;
          cnpj: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          responsible_person: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          company_name: string;
          trade_name?: string | null;
          cnpj?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          responsible_person?: string | null;
          is_active?: boolean;
        };
        Update: {
          company_name?: string;
          trade_name?: string | null;
          cnpj?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          responsible_person?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      user_companies: {
        Row: {
          id: string;
          user_id: string;
          company_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          company_id: string;
        };
        Update: {
          user_id?: string;
          company_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_companies_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_companies_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      documents: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          description: string | null;
          category: DocumentCategory;
          file_name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          uploaded_by: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
          workflow_status: DocumentWorkflowStatus;
          version: number;
          parent_document_id: string | null;
          uploaded_by_client: boolean;
        };
        Insert: {
          company_id: string;
          title: string;
          description?: string | null;
          category?: DocumentCategory;
          file_name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          uploaded_by: string;
          deleted_at?: string | null;
          workflow_status?: DocumentWorkflowStatus;
          version?: number;
          parent_document_id?: string | null;
          uploaded_by_client?: boolean;
        };
        Update: {
          company_id?: string;
          title?: string;
          description?: string | null;
          category?: DocumentCategory;
          file_name?: string;
          file_path?: string;
          file_size?: number;
          mime_type?: string;
          uploaded_by?: string;
          deleted_at?: string | null;
          workflow_status?: DocumentWorkflowStatus;
          version?: number;
          parent_document_id?: string | null;
          uploaded_by_client?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      document_downloads: {
        Row: {
          id: string;
          document_id: string;
          user_id: string;
          downloaded_at: string;
        };
        Insert: {
          document_id: string;
          user_id: string;
        };
        Update: never;
        Relationships: [];
      };
      tickets: {
        Row: {
          id: string;
          company_id: string;
          created_by: string;
          assigned_to: string | null;
          subject: string;
          description: string;
          status: TicketStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          company_id: string;
          created_by: string;
          assigned_to?: string | null;
          subject: string;
          description: string;
          status?: TicketStatus;
        };
        Update: {
          company_id?: string;
          created_by?: string;
          assigned_to?: string | null;
          subject?: string;
          description?: string;
          status?: TicketStatus;
        };
        Relationships: [
          {
            foreignKeyName: "tickets_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      ticket_messages: {
        Row: {
          id: string;
          ticket_id: string;
          sender_id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          ticket_id: string;
          sender_id: string;
          message: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: false;
            referencedRelation: "tickets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ticket_messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      ticket_attachments: {
        Row: {
          id: string;
          ticket_id: string;
          file_name: string;
          file_path: string;
          file_size: number;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          ticket_id: string;
          file_name: string;
          file_path: string;
          file_size: number;
          uploaded_by: string;
        };
        Update: never;
        Relationships: [];
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          summary: string;
          content: string;
          category: AnnouncementCategory;
          published: boolean;
          published_at: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          summary: string;
          content: string;
          category?: AnnouncementCategory;
          published?: boolean;
          published_at?: string | null;
          created_by: string;
        };
        Update: {
          title?: string;
          summary?: string;
          content?: string;
          category?: AnnouncementCategory;
          published?: boolean;
          published_at?: string | null;
          created_by?: string;
        };
        Relationships: [];
      };
      announcement_companies: {
        Row: {
          id: string;
          announcement_id: string;
          company_id: string;
        };
        Insert: {
          announcement_id: string;
          company_id: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: "announcement_companies_announcement_id_fkey";
            columns: ["announcement_id"];
            isOneToOne: false;
            referencedRelation: "announcements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcement_companies_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      lead_submissions: {
        Row: {
          id: string;
          name: string;
          company_name: string | null;
          email: string;
          phone: string | null;
          source: string | null;
          calculator_type: string | null;
          estimated_savings: number | null;
          created_at: string;
        };
        Insert: {
          name: string;
          company_name?: string | null;
          email: string;
          phone?: string | null;
          source?: string | null;
          calculator_type?: string | null;
          estimated_savings?: number | null;
        };
        Update: never;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Record<string, unknown> | null;
        };
        Update: never;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          message: string;
          is_read?: boolean;
        };
        Update: {
          is_read?: boolean;
        };
        Relationships: [];
      };
      document_status_history: {
        Row: {
          id: string;
          document_id: string;
          previous_status: DocumentWorkflowStatus | null;
          new_status: DocumentWorkflowStatus;
          changed_by: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          document_id: string;
          previous_status?: DocumentWorkflowStatus | null;
          new_status: DocumentWorkflowStatus;
          changed_by: string;
          reason?: string | null;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: "document_status_history_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_status_history_changed_by_fkey";
            columns: ["changed_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      document_comments: {
        Row: {
          id: string;
          document_id: string;
          author_id: string;
          content: string;
          is_internal: boolean;
          created_at: string;
        };
        Insert: {
          document_id: string;
          author_id: string;
          content: string;
          is_internal?: boolean;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: "document_comments_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      pending_actions: {
        Row: {
          id: string;
          company_id: string;
          created_by: string;
          title: string;
          description: string | null;
          action_type: string;
          priority: ActionPriority;
          due_date: string | null;
          status: string;
          document_id: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          company_id: string;
          created_by: string;
          title: string;
          description?: string | null;
          action_type?: string;
          priority?: ActionPriority;
          due_date?: string | null;
          status?: string;
          document_id?: string | null;
          completed_at?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          action_type?: string;
          priority?: ActionPriority;
          due_date?: string | null;
          status?: string;
          document_id?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pending_actions_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pending_actions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      workflow_assignments: {
        Row: {
          id: string;
          document_id: string;
          assigned_to: string;
          assigned_by: string;
          created_at: string;
        };
        Insert: {
          document_id: string;
          assigned_to: string;
          assigned_by: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: "workflow_assignments_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workflow_assignments_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      crm_leads: {
        Row: {
          id: string;
          name: string;
          company_name: string | null;
          cnpj: string | null;
          phone: string | null;
          email: string;
          source: string | null;
          industry: string | null;
          estimated_revenue: number | null;
          status: CrmLeadStatus;
          assigned_to: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          company_name?: string | null;
          cnpj?: string | null;
          phone?: string | null;
          email: string;
          source?: string | null;
          industry?: string | null;
          estimated_revenue?: number | null;
          status?: CrmLeadStatus;
          assigned_to?: string | null;
          notes?: string | null;
        };
        Update: {
          name?: string;
          company_name?: string | null;
          cnpj?: string | null;
          phone?: string | null;
          email?: string;
          source?: string | null;
          industry?: string | null;
          estimated_revenue?: number | null;
          status?: CrmLeadStatus;
          assigned_to?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      crm_opportunities: {
        Row: {
          id: string;
          title: string;
          company_id: string | null;
          lead_id: string | null;
          estimated_value: number | null;
          expected_close_date: string | null;
          stage: CrmOpportunityStage;
          assigned_to: string | null;
          probability: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          company_id?: string | null;
          lead_id?: string | null;
          estimated_value?: number | null;
          expected_close_date?: string | null;
          stage?: CrmOpportunityStage;
          assigned_to?: string | null;
          probability?: number | null;
          notes?: string | null;
        };
        Update: {
          title?: string;
          company_id?: string | null;
          lead_id?: string | null;
          estimated_value?: number | null;
          expected_close_date?: string | null;
          stage?: CrmOpportunityStage;
          assigned_to?: string | null;
          probability?: number | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      crm_proposals: {
        Row: {
          id: string;
          proposal_number: string;
          company_id: string | null;
          opportunity_id: string | null;
          plan: string | null;
          description: string | null;
          monthly_fee: number;
          setup_fee: number;
          validity_date: string | null;
          status: CrmProposalStatus;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          proposal_number: string;
          company_id?: string | null;
          opportunity_id?: string | null;
          plan?: string | null;
          description?: string | null;
          monthly_fee: number;
          setup_fee?: number;
          validity_date?: string | null;
          status?: CrmProposalStatus;
          created_by?: string | null;
        };
        Update: {
          plan?: string | null;
          description?: string | null;
          monthly_fee?: number;
          setup_fee?: number;
          validity_date?: string | null;
          status?: CrmProposalStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      crm_contracts: {
        Row: {
          id: string;
          contract_number: string;
          company_id: string | null;
          proposal_id: string | null;
          start_date: string | null;
          end_date: string | null;
          monthly_fee: number;
          status: CrmContractStatus;
          signed_document_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          contract_number: string;
          company_id?: string | null;
          proposal_id?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          monthly_fee: number;
          status?: CrmContractStatus;
          signed_document_url?: string | null;
          created_by?: string | null;
        };
        Update: {
          start_date?: string | null;
          end_date?: string | null;
          monthly_fee?: number;
          status?: CrmContractStatus;
          signed_document_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      crm_activities: {
        Row: {
          id: string;
          type: CrmActivityType;
          title: string;
          description: string | null;
          lead_id: string | null;
          opportunity_id: string | null;
          company_id: string | null;
          assigned_to: string | null;
          due_date: string | null;
          status: CrmTaskStatus;
          priority: ActionPriority;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          type: CrmActivityType;
          title: string;
          description?: string | null;
          lead_id?: string | null;
          opportunity_id?: string | null;
          company_id?: string | null;
          assigned_to?: string | null;
          due_date?: string | null;
          status?: CrmTaskStatus;
          priority?: ActionPriority;
          created_by?: string | null;
        };
        Update: {
          type?: CrmActivityType;
          title?: string;
          description?: string | null;
          lead_id?: string | null;
          opportunity_id?: string | null;
          company_id?: string | null;
          assigned_to?: string | null;
          due_date?: string | null;
          status?: CrmTaskStatus;
          priority?: ActionPriority;
          updated_at?: string;
        };
        Relationships: [];
      };
      crm_notes: {
        Row: {
          id: string;
          content: string;
          lead_id: string | null;
          opportunity_id: string | null;
          author_id: string;
          created_at: string;
        };
        Insert: {
          content: string;
          lead_id?: string | null;
          opportunity_id?: string | null;
          author_id: string;
        };
        Update: never;
        Relationships: [];
      };
      fees: {
        Row: {
          id: string;
          company_id: string;
          description: string;
          period: string;
          amount: number;
          due_date: string;
          status: FeeStatus;
          boleto_url: string | null;
          invoice_url: string | null;
          receipt_url: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          company_id: string;
          description: string;
          period: string;
          amount: number;
          due_date: string;
          status?: FeeStatus;
          boleto_url?: string | null;
          invoice_url?: string | null;
          receipt_url?: string | null;
          paid_at?: string | null;
        };
        Update: {
          company_id?: string;
          description?: string;
          period?: string;
          amount?: number;
          due_date?: string;
          status?: FeeStatus;
          boleto_url?: string | null;
          invoice_url?: string | null;
          receipt_url?: string | null;
          paid_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fees_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      plans: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          monthly_price: number;
          setup_fee: number;
          features: unknown;
          max_users: number | null;
          status: PlanStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          monthly_price: number;
          setup_fee?: number;
          features?: unknown;
          max_users?: number | null;
          status?: PlanStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          monthly_price?: number;
          setup_fee?: number;
          features?: unknown;
          max_users?: number | null;
          status?: PlanStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          company_id: string;
          plan_id: string | null;
          billing_cycle: BillingCycle;
          monthly_amount: number;
          setup_fee: number;
          start_date: string;
          renewal_date: string | null;
          trial_ends_at: string | null;
          status: SubscriptionStatus;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          plan_id?: string | null;
          billing_cycle?: BillingCycle;
          monthly_amount: number;
          setup_fee?: number;
          start_date?: string;
          renewal_date?: string | null;
          trial_ends_at?: string | null;
          status?: SubscriptionStatus;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          plan_id?: string | null;
          billing_cycle?: BillingCycle;
          monthly_amount?: number;
          setup_fee?: number;
          start_date?: string;
          renewal_date?: string | null;
          trial_ends_at?: string | null;
          status?: SubscriptionStatus;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: number;
          company_id: string;
          subscription_id: string | null;
          amount: number;
          due_date: string;
          issue_date: string;
          status: InvoiceStatus;
          payment_method: FinPaymentMethod | null;
          external_payment_id: string | null;
          boleto_url: string | null;
          pix_code: string | null;
          invoice_url: string | null;
          receipt_url: string | null;
          paid_at: string | null;
          notes: string | null;
          description: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_number?: number;
          company_id: string;
          subscription_id?: string | null;
          amount: number;
          due_date: string;
          issue_date?: string;
          status?: InvoiceStatus;
          payment_method?: FinPaymentMethod | null;
          external_payment_id?: string | null;
          boleto_url?: string | null;
          pix_code?: string | null;
          invoice_url?: string | null;
          receipt_url?: string | null;
          paid_at?: string | null;
          notes?: string | null;
          description?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: InvoiceStatus;
          payment_method?: FinPaymentMethod | null;
          external_payment_id?: string | null;
          boleto_url?: string | null;
          pix_code?: string | null;
          invoice_url?: string | null;
          receipt_url?: string | null;
          paid_at?: string | null;
          notes?: string | null;
          description?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit_price: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          description: string;
          quantity?: number;
          unit_price: number;
          total: number;
          created_at?: string;
        };
        Update: {
          description?: string;
          quantity?: number;
          unit_price?: number;
          total?: number;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          id: string;
          company_id: string;
          invoice_id: string | null;
          status: CollectionStatus;
          days_overdue: number | null;
          notes: string | null;
          assigned_to: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          invoice_id?: string | null;
          status?: CollectionStatus;
          days_overdue?: number | null;
          notes?: string | null;
          assigned_to?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: CollectionStatus;
          days_overdue?: number | null;
          notes?: string | null;
          assigned_to?: string | null;
          resolved_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      ticket_status: TicketStatus;
      document_category: DocumentCategory;
      announcement_category: AnnouncementCategory;
      fee_status: FeeStatus;
      document_workflow_status: DocumentWorkflowStatus;
      action_priority: ActionPriority;
      crm_lead_status: CrmLeadStatus;
      crm_opportunity_stage: CrmOpportunityStage;
      crm_proposal_status: CrmProposalStatus;
      crm_contract_status: CrmContractStatus;
      crm_activity_type: CrmActivityType;
      crm_task_status: CrmTaskStatus;
      crm_health_status: CrmHealthStatus;
      plan_status: PlanStatus;
      billing_cycle: BillingCycle;
      subscription_status: SubscriptionStatus;
      invoice_status: InvoiceStatus;
      fin_payment_method: FinPaymentMethod;
      fin_payment_status: FinPaymentStatus;
      collection_status: CollectionStatus;
    };
  };
}

// Convenience row types
export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
export type TicketRow = Database["public"]["Tables"]["tickets"]["Row"];
export type TicketMessageRow = Database["public"]["Tables"]["ticket_messages"]["Row"];
export type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type FeeRow = Database["public"]["Tables"]["fees"]["Row"];
export type DocumentStatusHistoryRow = Database["public"]["Tables"]["document_status_history"]["Row"];
export type DocumentCommentRow = Database["public"]["Tables"]["document_comments"]["Row"];
export type PendingActionRow = Database["public"]["Tables"]["pending_actions"]["Row"];
export type CrmLeadRow = Database["public"]["Tables"]["crm_leads"]["Row"];
export type CrmOpportunityRow = Database["public"]["Tables"]["crm_opportunities"]["Row"];
export type CrmProposalRow = Database["public"]["Tables"]["crm_proposals"]["Row"];
export type CrmContractRow = Database["public"]["Tables"]["crm_contracts"]["Row"];
export type CrmActivityRow = Database["public"]["Tables"]["crm_activities"]["Row"];
export type CrmNoteRow = Database["public"]["Tables"]["crm_notes"]["Row"];
export type PlanRow = Database["public"]["Tables"]["plans"]["Row"];
export type SubscriptionRow = Database["public"]["Tables"]["subscriptions"]["Row"];
export type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];
export type CollectionRow = Database["public"]["Tables"]["collections"]["Row"];
