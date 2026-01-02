"use client";

/**
 * AuthGuard - Protects routes that require authentication
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard component - Redirects to login if not authenticated
 */
export function AuthGuard({
  children,
  fallback,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the intended destination for redirect after login
      const currentPath = window.location.pathname;
      if (currentPath !== redirectTo) {
        sessionStorage.setItem("auth_redirect", currentPath);
      }
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // Show loading state
  if (isLoading) {
    return fallback ?? <AuthLoadingState />;
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return fallback ?? <AuthLoadingState />;
  }

  // Authenticated - render children
  return <>{children}</>;
}

/**
 * Default loading state for auth guard
 */
function AuthLoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

/**
 * GuestGuard - Redirects authenticated users away (e.g., from login page)
 */
interface GuestGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function GuestGuard({
  children,
  redirectTo = "/dashboard",
}: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check for stored redirect destination
      const storedRedirect = sessionStorage.getItem("auth_redirect");
      if (storedRedirect) {
        sessionStorage.removeItem("auth_redirect");
        router.push(storedRedirect);
      } else {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // Show loading state
  if (isLoading) {
    return <AuthLoadingState />;
  }

  // Authenticated - will redirect
  if (isAuthenticated) {
    return <AuthLoadingState />;
  }

  // Not authenticated - render children (login/register page)
  return <>{children}</>;
}
