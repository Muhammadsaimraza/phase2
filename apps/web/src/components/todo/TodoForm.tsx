"use client";

/**
 * TodoForm - Create/Edit todo form
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import type { Todo, TodoCreate, TodoPriority } from "@/types";
import { Button, Input } from "@/components/ui";

const todoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .optional()
    .nullable(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  due_date: z.string().optional().nullable(),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (data: TodoCreate) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const priorityOptions: { value: TodoPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TodoForm({
  todo,
  onSubmit,
  onCancel,
  isLoading,
}: TodoFormProps) {
  const isEditing = !!todo;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo?.title || "",
      description: todo?.description || "",
      priority: todo?.priority || "medium",
      due_date: todo?.due_date
        ? new Date(todo.due_date).toISOString().split("T")[0]
        : "",
    },
  });

  const handleFormSubmit = async (data: TodoFormData) => {
    await onSubmit({
      title: data.title,
      description: data.description || null,
      priority: data.priority,
      due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
    });
  };

  const loading = isLoading || isSubmitting;

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-5"
    >
      {/* Title */}
      <Input
        label="Task Title"
        placeholder="What needs to be done?"
        error={errors.title?.message}
        disabled={loading}
        {...register("title")}
      />

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Description
        </label>
        <textarea
          placeholder="Add more details... (optional)"
          rows={3}
          disabled={loading}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 transition-colors"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Priority
          </label>
          <select
            disabled={loading}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 transition-colors"
            {...register("priority")}
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            disabled={loading}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 transition-colors"
            {...register("due_date")}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          isLoading={loading}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg"
        >
          {isEditing ? "Save Changes" : "Create Task"}
        </Button>
      </div>
    </motion.form>
  );
}
