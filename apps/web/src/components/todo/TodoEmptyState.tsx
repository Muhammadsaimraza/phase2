"use client";

/**
 * TodoEmptyState - Empty state for todo list with amazing design
 */

import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { PlusIcon } from "@/components/ui/icons";

interface TodoEmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onCreateTodo?: () => void;
}

const floatingAnimation = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

export function TodoEmptyState({
  hasFilters,
  onClearFilters,
  onCreateTodo,
}: TodoEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-16 px-6 text-center shadow-sm"
    >
      {/* Animated Icon */}
      <motion.div
        {...floatingAnimation}
        className="mb-6 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 p-6 shadow-lg"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <svg
            className="h-12 w-12 text-cyan-600"
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
        </motion.div>
      </motion.div>

      {hasFilters ? (
        <>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
          >
            No matching tasks
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-base text-gray-600 max-w-sm"
          >
            Try adjusting your filters to see more results.
          </motion.p>
          {onClearFilters && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={onClearFilters}
                className="mt-6 shadow-md hover:shadow-lg"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </>
      ) : (
        <>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
          >
            No tasks yet
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-base text-gray-600 max-w-sm"
          >
            Start your productivity journey by creating your first task. Let&apos;s make today productive! 🚀
          </motion.p>
          {onCreateTodo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={onCreateTodo}
                className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg"
                leftIcon={<PlusIcon className="h-5 w-5" />}
              >
                Create Your First Task
              </Button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
