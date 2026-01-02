"use client";

/**
 * Login Page
 */

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GuestGuard, LoginForm } from "@/components";

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Check for stored redirect destination
    const redirect = sessionStorage.getItem("auth_redirect");
    if (redirect) {
      sessionStorage.removeItem("auth_redirect");
      router.push(redirect);
    } else {
      router.push("/dashboard");
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-2 text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form Card */}
          <div className="rounded-2xl bg-white p-8 shadow-lg shadow-gray-200/50">
            <LoginForm onSuccess={handleSuccess} />
          </div>
        </motion.div>
      </div>
    </GuestGuard>
  );
}
