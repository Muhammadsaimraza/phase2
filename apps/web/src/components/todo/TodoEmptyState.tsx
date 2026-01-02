"use client";

/**
 * TodoEmptyState - Empty state for todo list
 */

import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { PlusIcon } from "@/components/ui/icons";

interface TodoEmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onCreateTodo?: () => void;
}

export function TodoEmptyState({
  hasFilters,
  onClearFilters,
  onCreateTodo,
}: TodoEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center"
    >
      <div className="mb-4 rounded-full bg-gray-100 p-3">
        <svg
          className="h-8 w-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      </div>

      {hasFilters ? (
        <>
          <h3 className="text-lg font-semibold text-gray-900">
            No matching todos
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters to see more results.
          </p>
          {onClearFilters && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClearFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-900">No todos yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first todo.
          </p>
          {onCreateTodo && (
            <Button
              onClick={onCreateTodo}
              className="mt-4"
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              Create Todo
            </Button>
          )}
        </>
      )}
    </motion.div>
  );
}
