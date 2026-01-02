"use client";

/**
 * TodoFilters - Status and priority filters for todo list
 */

import type { TodoStatus, TodoPriority } from "@repo/shared";
import { cn } from "@/lib";

interface TodoFiltersProps {
  statusFilter: TodoStatus | undefined;
  priorityFilter: TodoPriority | undefined;
  onStatusChange: (status: TodoStatus | undefined) => void;
  onPriorityChange: (priority: TodoPriority | undefined) => void;
}

const statusOptions: { value: TodoStatus | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const priorityOptions: { value: TodoPriority | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function TodoFilters({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
}: TodoFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Status:</span>
        <div className="flex rounded-lg border border-gray-200 bg-white p-1">
          {statusOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => onStatusChange(option.value)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                statusFilter === option.value
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Priority:</span>
        <div className="flex rounded-lg border border-gray-200 bg-white p-1">
          {priorityOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => onPriorityChange(option.value)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                priorityFilter === option.value
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
