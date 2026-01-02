// Shared types between frontend and backend

// Auth types
export interface User {
  id: string; // UUID
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRegister {
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// Todo types
export type TodoStatus = "pending" | "in_progress" | "completed";
export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  id: string; // UUID
  user_id: string; // UUID
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  title: string;
  description?: string | null;
  priority?: TodoPriority;
  due_date?: string | null;
}

export interface TodoUpdate {
  title?: string;
  description?: string | null;
  status?: TodoStatus;
  priority?: TodoPriority;
  due_date?: string | null;
}

export interface TodoListResponse {
  items: Todo[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface TodoListParams {
  page?: number;
  per_page?: number;
  status?: TodoStatus;
  priority?: TodoPriority;
  sort_by?: "created_at" | "due_date" | "priority" | "title";
  sort_order?: "asc" | "desc";
}

// API Error types (RFC 7807)
export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
