"use client";

/**
 * Register Page
 */

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GuestGuard, RegisterForm } from "@/components";

export default function RegisterPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // After registration (and auto-login), redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Logo/Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
            <p className="mt-2 text-gray-600">
              Sign up to start managing your tasks
            </p>
          </div>

          {/* Register Form Card */}
          <div className="rounded-2xl bg-white p-8 shadow-lg shadow-gray-200/50">
            <RegisterForm onSuccess={handleSuccess} />
          </div>
        </motion.div>
      </div>
    </GuestGuard>
  );
}
