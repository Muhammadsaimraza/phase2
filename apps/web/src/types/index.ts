/**
 * Shared type definitions for the Todo application
 */

/* ============================================================================
   Auth Types
   ============================================================================ */

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  full_name?: string;
}

/* ============================================================================
   Todo Types
   ============================================================================ */

export type TodoStatus = "pending" | "in_progress" | "completed";
export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  user_id: string;
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
  title?: string | null;
  description?: string | null;
  status?: TodoStatus | null;
  priority?: TodoPriority | null;
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

/* ============================================================================
   Error Types (RFC 7807)
   ============================================================================ */

export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ValidationErrorResponse extends Omit<ProblemDetail, 'detail'> {
  detail: ValidationError[];
}
