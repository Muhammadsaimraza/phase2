"use client";

/**
 * Dashboard - Main todo list view with amazing UI (protected route)
 */

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              My Tasks
            </h1>
            {user && (
              <p className="text-sm text-gray-300 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                {user.email}
              </p>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              disabled={isLoading}
              leftIcon={<LogoutIcon className="h-4 w-4" />}
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20 shadow-lg"
            >
              Logout
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Welcome Section */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20"></div>
            <div className="relative rounded-2xl bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-400/30 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back! 👋
              </h2>
              <p className="text-gray-300">
                Let's make today productive. Manage your tasks efficiently and track your progress.
              </p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Total Tasks",
                icon: "📋",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-500/10",
                borderColor: "border-blue-400/30",
              },
              {
                label: "In Progress",
                icon: "⚡",
                color: "from-yellow-500 to-orange-500",
                bgColor: "bg-yellow-500/10",
                borderColor: "border-yellow-400/30",
              },
              {
                label: "Completed",
                icon: "✅",
                color: "from-green-500 to-teal-500",
                bgColor: "bg-green-500/10",
                borderColor: "border-green-400/30",
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (idx + 2) }}
                whileHover={{ scale: 1.05 }}
                className={`relative rounded-xl border ${stat.borderColor} ${stat.bgColor} p-6 backdrop-blur-xl cursor-pointer group`}
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity rounded-xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mt-2">—</p>
                    </div>
                    <span className="text-4xl">{stat.icon}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Todo List Section */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-transparent rounded-2xl blur opacity-10"></div>
            <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl p-8">
              <TodoList />
            </div>
          </motion.div>
        </motion.div>
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
