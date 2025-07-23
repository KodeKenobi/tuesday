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
  Star,
  Zap,
  Eye,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
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
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
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
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: Eye,
    bgColor: "bg-purple-500/10",
  },
  COMPLETE: {
    label: "Complete",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle,
    bgColor: "bg-green-500/10",
  },
};

const priorityConfig = {
  LOW: {
    label: "Low",
    icon: CheckCircle,
    color: "text-green-400 bg-green-400/10 border-green-400/20",
  },
  MEDIUM: {
    label: "Medium",
    icon: Clock,
    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  },
  HIGH: {
    label: "High",
    icon: AlertCircle,
    color: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  },
  URGENT: {
    label: "Urgent",
    icon: Star,
    color: "text-red-400 bg-red-400/10 border-red-400/20",
  },
};

// Sortable Ticket Component
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

  const priority = ticket.priority
    ? priorityConfig[ticket.priority as keyof typeof priorityConfig]
    : null;
  const PriorityIcon = priority?.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all cursor-pointer group touch-none",
        isDragging && "opacity-50 rotate-2 scale-105 shadow-2xl"
      )}
      onClick={onClick}
    >
      {/* Ticket Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-white font-medium text-sm line-clamp-2 flex-1">
          {ticket.title}
        </h4>
        <button className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      {ticket.description && (
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">
          {ticket.description}
        </p>
      )}

      {/* Tags */}
      {ticket.tags && ticket.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {ticket.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {ticket.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
              +{ticket.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Ticket Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {ticket.assignee && (
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {ticket.assignee.name.charAt(0)}
              </span>
            </div>
          )}
          {ticket.priority && PriorityIcon && (
            <div className={cn("p-1 rounded border", priority.color)}>
              <PriorityIcon className="w-3 h-3" />
            </div>
          )}
        </div>

        <div className="text-gray-400 text-xs">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

// Dragged Ticket Overlay
function DraggedTicket({ ticket }: { ticket: Ticket }) {
  const priority = ticket.priority
    ? priorityConfig[ticket.priority as keyof typeof priorityConfig]
    : null;
  const PriorityIcon = priority?.icon;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 shadow-2xl w-80">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-white font-medium text-sm line-clamp-2 flex-1">
          {ticket.title}
        </h4>
      </div>

      {ticket.description && (
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">
          {ticket.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {ticket.assignee && (
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {ticket.assignee.name.charAt(0)}
              </span>
            </div>
          )}
          {ticket.priority && PriorityIcon && (
            <div className={cn("p-1 rounded border", priority.color)}>
              <PriorityIcon className="w-3 h-3" />
            </div>
          )}
        </div>

        <div className="text-gray-400 text-xs">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

// Droppable Column
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

  // Group tickets by status
  const groupedTickets = tickets.reduce((acc, ticket) => {
    if (!acc[ticket.status]) {
      acc[ticket.status] = [];
    }
    acc[ticket.status].push(ticket);
    return acc;
  }, {} as Record<string, Ticket[]>);

  // Ensure all status columns exist
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
    })
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

    // Find the current status of the dragged ticket
    let currentStatus = "";
    Object.entries(groupedTickets).forEach(([status, tickets]) => {
      if (tickets.find((t) => t.id === activeId)) {
        currentStatus = status;
      }
    });

    // If dropped on a status column, update the ticket status
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
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800/50 min-h-[600px]">
                {/* Column Header */}
                <div className="p-4 border-b border-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={cn("p-1 rounded-lg", config.bgColor)}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      <h3 className="text-white font-semibold text-sm">
                        {config.label}
                      </h3>
                    </div>
                    <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full">
                      {tickets.length}
                    </span>
                  </div>

                  {/* Add Ticket Button */}
                  {userRole === "USER" && (
                    <button
                      onClick={onCreateTicket}
                      className="w-full mt-2 p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all text-sm flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add ticket</span>
                    </button>
                  )}
                </div>

                {/* Tickets */}
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
                    <div className="text-center py-8 text-gray-400 text-sm">
                      <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Tag className="w-4 h-4" />
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
