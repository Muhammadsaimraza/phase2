"use client";

/**
 * TodoFilters - Status and priority filters for todo list with modern design
 */

import { motion } from "framer-motion";
import type { TodoStatus, TodoPriority } from "@/types";
import { cn } from "@/lib";

interface TodoFiltersProps {
  statusFilter: TodoStatus | undefined;
  priorityFilter: TodoPriority | undefined;
  onStatusChange: (status: TodoStatus | undefined) => void;
  onPriorityChange: (priority: TodoPriority | undefined) => void;
}

const statusOptions: { value: TodoStatus | undefined; label: string; icon: string }[] = [
  { value: undefined, label: "All", icon: "📋" },
  { value: "pending", label: "Pending", icon: "⏳" },
  { value: "in_progress", label: "In Progress", icon: "⚡" },
  { value: "completed", label: "Completed", icon: "✅" },
];

const priorityOptions: { value: TodoPriority | undefined; label: string; icon: string }[] = [
  { value: undefined, label: "All", icon: "🎯" },
  { value: "high", label: "High", icon: "🔴" },
  { value: "medium", label: "Medium", icon: "🟡" },
  { value: "low", label: "Low", icon: "🟢" },
];

export function TodoFilters({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
}: TodoFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-gradient-to-r from-white to-blue-50/30 border border-blue-200/40 p-5 shadow-md"
    >
      <div className="space-y-5">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Filter by Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option, idx) => (
              <motion.button
                key={option.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onStatusChange(option.value)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all shadow-sm",
                  statusFilter === option.value
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{option.icon}</span>
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Filter by Priority
          </label>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map((option, idx) => (
              <motion.button
                key={option.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onPriorityChange(option.value)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all shadow-sm",
                  priorityFilter === option.value
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md hover:shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{option.icon}</span>
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
