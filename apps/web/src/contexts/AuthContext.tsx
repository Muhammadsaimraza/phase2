"use client";

/**
 * AuthContext - React context for authentication state management
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User, UserLogin, UserRegister } from "@repo/shared";
import {
  authClient,
  tokenStorage,
  onAuthEvent,
  emitAuthEvent,
  ApiError,
} from "@/lib";

/**
 * Auth context state and methods
 */
interface AuthContextValue {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Methods
  login: (data: UserLogin) => Promise<void>;
  register: (data: UserRegister) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Auth provider props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - Wraps the app to provide authentication state
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useMemo(() => {
    return user !== null && tokenStorage.hasTokens();
  }, [user]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Fetch current user from API
   */
  const refreshUser = useCallback(async () => {
    if (!tokenStorage.hasTokens()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      // Ensure token is valid before fetching
      const hasValidToken = await authClient.ensureValidToken();
      if (!hasValidToken) {
        setUser(null);
        setIsLoading(false);
        emitAuthEvent("session_expired");
        return;
      }

      const currentUser = await authClient.getMe();
      setUser(currentUser);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
      tokenStorage.clearTokens();
      emitAuthEvent("session_expired");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login with email and password
   */
  const login = useCallback(async (data: UserLogin) => {
    setIsLoading(true);
    setError(null);

    try {
      await authClient.login(data);
      const currentUser = await authClient.getMe();
      setUser(currentUser);
      emitAuthEvent("login");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.detail : "Login failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback(async (data: UserRegister): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      const newUser = await authClient.register(data);
      // Automatically log in after registration
      await authClient.login({ email: data.email, password: data.password });
      const currentUser = await authClient.getMe();
      setUser(currentUser);
      emitAuthEvent("login");
      return newUser;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.detail
          : "Registration failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout the current user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await authClient.logout();
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
      emitAuthEvent("logout");
    }
  }, []);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /**
   * Listen for auth events from other tabs/windows
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token") {
        if (e.newValue === null) {
          // Token was removed (logged out in another tab)
          setUser(null);
        } else if (e.oldValue === null) {
          // Token was added (logged in in another tab)
          refreshUser();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshUser]);

  /**
   * Subscribe to auth events
   */
  useEffect(() => {
    const unsubscribe = onAuthEvent((event) => {
      if (event === "session_expired") {
        setUser(null);
        setError("Your session has expired. Please log in again.");
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      error,
      login,
      register,
      logout,
      refreshUser,
      clearError,
    }),
    [user, isLoading, isAuthenticated, error, login, register, logout, refreshUser, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth hook - Access auth context
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

/**
 * useUser hook - Access current user (convenience)
 */
export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

/**
 * useIsAuthenticated hook - Check if authenticated (convenience)
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}
