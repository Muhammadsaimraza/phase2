"use client";

/**
 * Dashboard - Main todo list view (protected route)
 */

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts";
import { Button } from "@/components/ui";
import { LogoutIcon } from "@/components/ui/icons";
import { TodoList } from "@/components/todo";
import { AuthGuard } from "@/components/auth";

function DashboardContent() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-primary-600">Todo App</h1>
            {user && (
              <p className="text-sm text-gray-500">{user.email}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            leftIcon={<LogoutIcon className="h-4 w-4" />}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <TodoList />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
