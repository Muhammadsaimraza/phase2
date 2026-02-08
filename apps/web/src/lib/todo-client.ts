/**
 * Todo API Client - CRUD operations for todos
 */

import type {
  Todo,
  TodoCreate,
  TodoUpdate,
  TodoListResponse,
  TodoListParams,
} from "@/types";
import { api } from "./api-client";

const TODOS_BASE = "/api/v1/todos";

/**
 * Build query string from params
 */
function buildQueryString(params: TodoListParams): string {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.per_page) searchParams.set("per_page", params.per_page.toString());
  if (params.status) searchParams.set("status", params.status);
  if (params.priority) searchParams.set("priority", params.priority);
  if (params.sort_by) searchParams.set("sort_by", params.sort_by);
  if (params.sort_order) searchParams.set("sort_order", params.sort_order);

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Todo API client
 */
export const todoClient = {
  /**
   * List todos with optional filtering and pagination
   */
  async list(params: TodoListParams = {}): Promise<TodoListResponse> {
    const queryString = buildQueryString(params);
    return api.get<TodoListResponse>(`${TODOS_BASE}${queryString}`);
  },

  /**
   * Get a single todo by ID
   */
  async get(id: string): Promise<Todo> {
    return api.get<Todo>(`${TODOS_BASE}/${id}`);
  },

  /**
   * Create a new todo
   */
  async create(data: TodoCreate): Promise<Todo> {
    return api.post<Todo>(TODOS_BASE, data);
  },

  /**
   * Update a todo (partial update)
   */
  async update(id: string, data: TodoUpdate): Promise<Todo> {
    return api.patch<Todo>(`${TODOS_BASE}/${id}`, data);
  },

  /**
   * Delete a todo
   */
  async delete(id: string): Promise<void> {
    await api.delete(`${TODOS_BASE}/${id}`);
  },

  /**
   * Mark a todo as complete
   */
  async complete(id: string): Promise<Todo> {
    return api.post<Todo>(`${TODOS_BASE}/${id}/complete`);
  },
};
