"use client";

/**
 * TodoList - List of todos with filtering, pagination, and actions
 */

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { Todo, TodoStatus, TodoPriority, TodoCreate, TodoUpdate } from "@repo/shared";
import { todoClient } from "@/lib/todo-client";
import { ApiError } from "@/lib";
import { Button } from "@/components/ui";
import { PlusIcon } from "@/components/ui/icons";
import { TodoItem } from "./TodoItem";
import { TodoForm } from "./TodoForm";
import { TodoFilters } from "./TodoFilters";
import { TodoEmptyState } from "./TodoEmptyState";

interface TodoListProps {
  initialTodos?: Todo[];
}

export function TodoList({ initialTodos = [] }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<TodoStatus | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<TodoPriority | undefined>();

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch todos
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await todoClient.list({
        page,
        per_page: 20,
        status: statusFilter,
        priority: priorityFilter,
        sort_by: "created_at",
        sort_order: "desc",
      });

      setTodos(response.items);
      setTotalPages(response.pages);
      setTotal(response.total);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.detail : "Failed to load todos";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Create todo
  const handleCreate = async (data: TodoCreate) => {
    setIsSubmitting(true);
    try {
      const newTodo = await todoClient.create(data);
      setTodos((prev) => [newTodo, ...prev]);
      setTotal((prev) => prev + 1);
      setShowForm(false);
      toast.success("Todo created successfully");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.detail : "Failed to create todo";
      toast.error(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update todo
  const handleUpdate = async (data: TodoCreate) => {
    if (!editingTodo) return;

    setIsSubmitting(true);
    try {
      const updateData: TodoUpdate = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        due_date: data.due_date,
      };
      const updated = await todoClient.update(editingTodo.id, updateData);
      setTodos((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      setEditingTodo(null);
      toast.success("Todo updated successfully");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.detail : "Failed to update todo";
      toast.error(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete todo
  const handleComplete = async (id: string) => {
    try {
      const completed = await todoClient.complete(id);
      setTodos((prev) =>
        prev.map((t) => (t.id === completed.id ? completed : t))
      );
      toast.success("Todo completed!");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.detail : "Failed to complete todo";
      toast.error(message);
    }
  };

  // Delete todo
  const handleDelete = async (id: string) => {
    try {
      await todoClient.delete(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setTotal((prev) => prev - 1);
      toast.success("Todo deleted");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.detail : "Failed to delete todo";
      toast.error(message);
    }
  };

  // Edit todo
  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
          <p className="text-sm text-gray-500">{total} items total</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingTodo(null);
          }}
          leftIcon={<PlusIcon className="h-4 w-4" />}
        >
          New Todo
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(showForm || editingTodo) && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            {editingTodo ? "Edit Todo" : "Create New Todo"}
          </h2>
          <TodoForm
            todo={editingTodo || undefined}
            onSubmit={editingTodo ? handleUpdate : handleCreate}
            onCancel={handleCancelForm}
            isLoading={isSubmitting}
          />
        </div>
      )}

      {/* Filters */}
      <TodoFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onStatusChange={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
        onPriorityChange={(priority) => {
          setPriorityFilter(priority);
          setPage(1);
        }}
      />

      {/* Todo List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
          {error}
          <Button variant="ghost" size="sm" onClick={fetchTodos} className="ml-2">
            Retry
          </Button>
        </div>
      ) : todos.length === 0 ? (
        <TodoEmptyState
          hasFilters={!!statusFilter || !!priorityFilter}
          onClearFilters={() => {
            setStatusFilter(undefined);
            setPriorityFilter(undefined);
          }}
          onCreateTodo={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
