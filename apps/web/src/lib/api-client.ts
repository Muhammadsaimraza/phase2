/**
 * API Client - Typed fetch wrapper for backend communication
 */

import type { ProblemDetail } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
    public type?: string
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/**
 * Get the current access token from storage
 */
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  // Only proceed if in browser context
  if (typeof window === "undefined") {
    throw new Error("API requests can only be made from the browser");
  }

  const { body, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  // Add auth header if token exists
  const token = getAccessToken();
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  // Build config with proper typing
  const config: RequestInit = {
    headers,
    ...rest,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error occurred";
    throw new ApiError(0, `Network error: ${message}`);
  }

  // Handle non-OK responses
  if (!response.ok) {
    let errorDetail = "An error occurred";
    let errorType: string | undefined;

    try {
      const errorBody = (await response.json()) as ProblemDetail | { detail: string };
      if ("detail" in errorBody && errorBody.detail) {
        errorDetail = errorBody.detail;
      }
      if ("type" in errorBody && errorBody.type) {
        errorType = errorBody.type;
      }
    } catch {
      errorDetail = response.statusText || "Unknown error";
    }

    throw new ApiError(response.status, errorDetail, errorType);
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

/**
 * API client with typed methods
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
