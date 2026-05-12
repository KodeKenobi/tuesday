"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Eye,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Ticket {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  client?: {
    id: string;
    name: string;
    email: string;
  };
  team?: {
    id: string;
    name: string;
  } | null;
}

interface KanbanBoardProps {
  tickets: Ticket[];
  onStatusChange: (ticketId: string, newStatus: string) => void;
  onTicketClick: (ticket: Ticket) => void;
  userRole: string;
  onCreateTicket: () => void;
}

const statusConfig = {
  BACKLOG: {
    label: "Backlog",
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    icon: Clock,
    bgColor: "bg-gray-500/10",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Zap,
    bgColor: "bg-blue-500/10",
  },
  REVISIONS: {
    label: "Revisions",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: AlertCircle,
    bgColor: "bg-yellow-500/10",
  },
  CLIENT_REVIEW: {
    label: "Client Review",
    color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    icon: Eye,
    bgColor: "bg-indigo-500/10",
  },
  COMPLETE: {
    label: "Complete",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle,
    bgColor: "bg-green-500/10",
  },
};

function SortableTicket({
  ticket,
  onClick,
}: {
  ticket: Ticket;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group touch-none",
        isDragging && "opacity-75 scale-105 shadow-2xl",
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-slate-900 font-medium text-sm line-clamp-2 flex-1">
          {ticket.title}
        </h4>
        <button className="text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-gray-500 text-xs">
          {ticket.client?.name || "No client"}
        </div>
        <div className="text-gray-500 text-xs">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

function DraggedTicket({ ticket }: { ticket: Ticket }) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-2xl w-80">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-slate-900 font-medium text-sm line-clamp-2 flex-1">
          {ticket.title}
        </h4>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-gray-500 text-xs">
          {ticket.client?.name || "No client"}
        </div>
        <div className="text-gray-500 text-xs">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({
  status,
  children,
}: {
  status: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef} className="h-full">
      {children}
    </div>
  );
}

export default function KanbanBoard({
  tickets,
  onStatusChange,
  onTicketClick,
  userRole,
  onCreateTicket,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const groupedTickets = tickets.reduce(
    (acc, ticket) => {
      if (!acc[ticket.status]) {
        acc[ticket.status] = [];
      }
      acc[ticket.status].push(ticket);
      return acc;
    },
    {} as Record<string, Ticket[]>,
  );

  Object.keys(statusConfig).forEach((status) => {
    if (!groupedTickets[status]) {
      groupedTickets[status] = [];
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    let currentStatus = "";
    Object.entries(groupedTickets).forEach(([status, tickets]) => {
      if (tickets.find((t) => t.id === activeId)) {
        currentStatus = status;
      }
    });

    if (
      Object.keys(statusConfig).includes(overId) &&
      currentStatus !== overId
    ) {
      onStatusChange(activeId, overId);
    }
  };

  const activeTicket = activeId ? tickets.find((t) => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Object.entries(groupedTickets).map(([status, tickets]) => {
          const config = statusConfig[status as keyof typeof statusConfig];
          const StatusIcon = config.icon;

          return (
            <DroppableColumn key={status} status={status}>
              <div className="bg-white/95 rounded-xl border border-gray-200 min-h-[600px] shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={cn("p-1 rounded-lg", config.bgColor)}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      <h3 className="text-slate-900 font-semibold text-sm">
                        {config.label}
                      </h3>
                    </div>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tickets.length}
                    </span>
                  </div>

                  {(userRole === "USER" || userRole === "SUPER_ADMIN") && (
                    <button
                      onClick={onCreateTicket}
                      className="w-full mt-2 p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all text-sm flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add ticket</span>
                    </button>
                  )}
                </div>

                <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                  <SortableContext
                    items={tickets.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {tickets.map((ticket) => (
                      <SortableTicket
                        key={ticket.id}
                        ticket={ticket}
                        onClick={() => onTicketClick(ticket)}
                      />
                    ))}
                  </SortableContext>

                  {tickets.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                      </div>
                      No tickets
                    </div>
                  )}
                </div>
              </div>
            </DroppableColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeTicket ? <DraggedTicket ticket={activeTicket} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
