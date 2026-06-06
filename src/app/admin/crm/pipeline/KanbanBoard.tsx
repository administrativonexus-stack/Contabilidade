"use client";

import { useState } from "react";
import Link from "next/link";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, DollarSign } from "lucide-react";
import { moveOpportunity } from "./actions";
import type { CrmOpportunityStage } from "@/types/database";

const STAGES: { value: CrmOpportunityStage; label: string; color: string }[] = [
  { value: "new_lead", label: "Novo Lead", color: "bg-slate-100 border-slate-200" },
  { value: "initial_contact", label: "Contato Inicial", color: "bg-blue-50 border-blue-200" },
  { value: "discovery", label: "Descoberta", color: "bg-violet-50 border-violet-200" },
  { value: "proposal_sent", label: "Proposta Enviada", color: "bg-amber-50 border-amber-200" },
  { value: "negotiation", label: "Negociação", color: "bg-orange-50 border-orange-200" },
  { value: "won", label: "Ganho", color: "bg-emerald-50 border-emerald-200" },
  { value: "lost", label: "Perdido", color: "bg-rose-50 border-rose-200" },
];

interface Opportunity {
  id: string;
  title: string;
  stage: CrmOpportunityStage;
  estimated_value: number | null;
  crm_leads: { name: string; company_name: string | null } | null;
}

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

function OpportunityCard({ opp, isDragging = false }: { opp: Opportunity; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSorting } = useSortable({ id: opp.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isSorting ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`bg-white rounded-xl border border-slate-200 p-3 shadow-sm group cursor-grab active:cursor-grabbing ${isDragging ? "shadow-lg rotate-1" : "hover:border-[#2563EB]/30"}`}>
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="mt-0.5 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0">
          <GripVertical className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/admin/crm/opportunities/${opp.id}`} className="text-sm font-medium text-[#0F3D5E] hover:text-[#2563EB] transition-colors line-clamp-2">
            {opp.title}
          </Link>
          {opp.crm_leads && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{opp.crm_leads.company_name ?? opp.crm_leads.name}</p>
          )}
          {opp.estimated_value && (
            <p className="text-xs text-[#10B981] font-semibold mt-1.5 flex items-center gap-0.5">
              <DollarSign className="w-3 h-3" />{formatCurrency(opp.estimated_value)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface Props {
  opportunities: Opportunity[];
}

export default function KanbanBoard({ opportunities: initial }: Props) {
  const [opportunities, setOpportunities] = useState(initial);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const activeOpp = opportunities.find((o) => o.id === activeId);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const targetStage = over.data.current?.stage as CrmOpportunityStage | undefined;
    if (!targetStage) return;

    const opp = opportunities.find((o) => o.id === active.id);
    if (!opp || opp.stage === targetStage) return;

    setOpportunities((prev) => prev.map((o) => o.id === active.id ? { ...o, stage: targetStage } : o));
    await moveOpportunity(active.id as string, targetStage);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 200px)" }}>
        {STAGES.map((stage) => {
          const stageOpps = opportunities.filter((o) => o.stage === stage.value);
          const totalValue = stageOpps.reduce((sum, o) => sum + (o.estimated_value ?? 0), 0);

          return (
            <SortableContext
              key={stage.value}
              id={stage.value}
              items={stageOpps.map((o) => o.id)}
              strategy={verticalListSortingStrategy}
            >
              <DroppableColumn stage={stage.value} color={stage.color} label={stage.label} count={stageOpps.length} totalValue={totalValue}>
                {stageOpps.map((opp) => <OpportunityCard key={opp.id} opp={opp} />)}
              </DroppableColumn>
            </SortableContext>
          );
        })}
      </div>

      <DragOverlay>
        {activeOpp && (
          <div className="w-[220px] shadow-2xl">
            <OpportunityCard opp={activeOpp} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function DroppableColumn({
  stage, color, label, count, totalValue, children,
}: {
  stage: CrmOpportunityStage; color: string; label: string; count: number; totalValue: number; children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useSortable({
    id: stage,
    data: { stage },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-[220px] rounded-2xl border p-3 flex flex-col gap-2 transition-colors ${isOver ? "border-[#2563EB] bg-blue-50/50" : color}`}
    >
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <span className="text-[10px] font-bold bg-white/80 px-1.5 py-0.5 rounded-full text-slate-500">{count}</span>
      </div>
      {totalValue > 0 && (
        <p className="text-[10px] text-slate-400 px-1 -mt-1">
          {totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 })}
        </p>
      )}
      <div className="flex flex-col gap-2 flex-1">
        {children}
      </div>
    </div>
  );
}
