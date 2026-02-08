"use client";

/**
 * TodoItem - Single todo card with actions
 */

import { useState } from "react";
import { motion } from "framer-motion";
import type { Todo, TodoStatus, TodoPriority } from "@/types";
import { cn } from "@/lib";
import { Button } from "@/components/ui";
import {
  CheckIcon,
  TrashIcon,
  PencilIcon,
  ClockIcon,
} from "@/components/ui/icons";

interface TodoItemProps {
  todo: Todo;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (todo: Todo) => void;
  isLoading?: boolean;
}

const priorityColors: Record<TodoPriority, string> = {
  low: "bg-emerald-100/80 text-emerald-700 border border-emerald-200",
  medium: "bg-amber-100/80 text-amber-700 border border-amber-200",
  high: "bg-rose-100/80 text-rose-700 border border-rose-200",
};

const statusColors: Record<TodoStatus, string> = {
  pending: "bg-slate-100/80 text-slate-700 border border-slate-200",
  in_progress: "bg-cyan-100/80 text-cyan-700 border border-cyan-200",
  completed: "bg-teal-100/80 text-teal-700 border border-teal-200",
};

export function TodoItem({
  todo,
  onComplete,
  onDelete,
  onEdit,
  isLoading,
}: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isCompleted = todo.status === "completed";

  const handleComplete = () => {
    if (!isCompleted && onComplete) {
      onComplete(todo.id);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      setIsDeleting(true);
      onDelete(todo.id);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue =
    todo.due_date &&
    !isCompleted &&
    new Date(todo.due_date) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "group rounded-xl border bg-white p-5 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5",
        isCompleted && "bg-gradient-to-br from-slate-50 to-slate-100 opacity-75",
        isDeleting && "opacity-50"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleComplete}
          disabled={isCompleted || isLoading}
          className={cn(
            "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all hover:scale-110",
            isCompleted
              ? "border-teal-500 bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-md"
              : "border-gray-300 hover:border-teal-400 hover:shadow-sm"
          )}
        >
          {isCompleted && <CheckIcon className="h-4 w-4" />}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "font-semibold text-gray-900 text-base leading-snug",
                isCompleted && "text-gray-500 line-through"
              )}
            >
              {todo.title}
            </h3>

            {/* Actions (shown on hover) */}
            <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(todo)}
                  disabled={isLoading}
                  className="h-8 w-8 p-0"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading || isDeleting}
                  className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Description */}
          {todo.description && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {todo.description}
            </p>
          )}

          {/* Meta */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* Priority */}
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                priorityColors[todo.priority]
              )}
            >
              {todo.priority}
            </span>

            {/* Status */}
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                statusColors[todo.status]
              )}
            >
              {todo.status.replace("_", " ")}
            </span>

            {/* Due date */}
            {todo.due_date && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs",
                  isOverdue ? "text-red-600" : "text-gray-500"
                )}
              >
                <ClockIcon className="h-3 w-3" />
                {formatDate(todo.due_date)}
                {isOverdue && " (overdue)"}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
