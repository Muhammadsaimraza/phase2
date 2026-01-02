"use client";

/**
 * TodoItem - Single todo card with actions
 */

import { useState } from "react";
import { motion } from "framer-motion";
import type { Todo, TodoStatus, TodoPriority } from "@repo/shared";
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
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const statusColors: Record<TodoStatus, string> = {
  pending: "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
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
        "group rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md",
        isCompleted && "bg-gray-50 opacity-75",
        isDeleting && "opacity-50"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleComplete}
          disabled={isCompleted || isLoading}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
            isCompleted
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300 hover:border-primary-500"
          )}
        >
          {isCompleted && <CheckIcon className="h-3 w-3" />}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "font-medium text-gray-900",
                isCompleted && "text-gray-500 line-through"
              )}
            >
              {todo.title}
            </h3>

            {/* Actions (shown on hover) */}
            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
