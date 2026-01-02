/**
 * Auth Client - Token management and authentication utilities
 */

import type {
  TokenResponse,
  User,
  UserLogin,
  UserRegister,
} from "@repo/shared";
import { api, ApiError } from "./api-client";

// Storage keys
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_EXPIRY_KEY = "token_expiry";

/**
 * Token storage utilities
 */
export const tokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getTokenExpiry(): number | null {
    if (typeof window === "undefined") return null;
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  },

  setTokens(tokens: TokenResponse): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
    // Store expiry as timestamp
    const expiryTime = Date.now() + tokens.expires_in * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    // Consider token expired 1 minute before actual expiry
    return Date.now() > expiry - 60000;
  },

  hasTokens(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  },
};

/**
 * Auth API client
 */
export const authClient = {
  /**
   * Register a new user
   */
  async register(data: UserRegister): Promise<User> {
    return api.post<User>("/api/v1/auth/register", data);
  },

  /**
   * Login with email and password
   */
  async login(data: UserLogin): Promise<TokenResponse> {
    const tokens = await api.post<TokenResponse>("/api/v1/auth/login", data);
    tokenStorage.setTokens(tokens);
    return tokens;
  },

  /**
   * Refresh the access token
   */
  async refresh(): Promise<TokenResponse> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new ApiError(401, "No refresh token available");
    }

    const tokens = await api.post<TokenResponse>("/api/v1/auth/refresh", {
      refresh_token: refreshToken,
    });
    tokenStorage.setTokens(tokens);
    return tokens;
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await api.post("/api/v1/auth/logout");
    } catch {
      // Ignore errors on logout - clear tokens anyway
    } finally {
      tokenStorage.clearTokens();
    }
  },

  /**
   * Get the current user profile
   */
  async getMe(): Promise<User> {
    return api.get<User>("/api/v1/auth/me");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenStorage.hasTokens() && !tokenStorage.isTokenExpired();
  },

  /**
   * Refresh token if needed before making a request
   */
  async ensureValidToken(): Promise<boolean> {
    if (!tokenStorage.hasTokens()) {
      return false;
    }

    if (tokenStorage.isTokenExpired()) {
      try {
        await this.refresh();
        return true;
      } catch {
        tokenStorage.clearTokens();
        return false;
      }
    }

    return true;
  },
};

/**
 * Auth event types for pub/sub
 */
export type AuthEvent = "login" | "logout" | "token_refresh" | "session_expired";

type AuthEventCallback = (event: AuthEvent) => void;

const listeners: Set<AuthEventCallback> = new Set();

/**
 * Subscribe to auth events
 */
export function onAuthEvent(callback: AuthEventCallback): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/**
 * Emit an auth event
 */
export function emitAuthEvent(event: AuthEvent): void {
  listeners.forEach((callback) => callback(event));
}
