"use client";

/**
 * RegisterForm - User registration form with validation
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

import { useAuth } from "@/contexts";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { Button, Input, AlertCircleIcon, CheckIcon } from "@/components/ui";

interface RegisterFormProps {
  onSuccess?: () => void;
}

const passwordRequirements = [
  { regex: /.{8,}/, label: "At least 8 characters" },
  { regex: /[A-Z]/, label: "One uppercase letter" },
  { regex: /[0-9]/, label: "One number" },
];

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register: registerUser, error, clearError, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    clearError();

    try {
      await registerUser({ email: data.email, password: data.password });
      toast.success("Account created successfully!");
      onSuccess?.();
    } catch {
      // Error is handled by AuthContext
    }
  };

  const loading = isLoading || isSubmitting;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700"
        >
          <AlertCircleIcon className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {/* Email Field */}
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        disabled={loading}
        {...register("email")}
      />

      {/* Password Field */}
      <div className="space-y-2">
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password?.message}
          disabled={loading}
          {...register("password")}
        />

        {/* Password Requirements */}
        <div className="space-y-1">
          {passwordRequirements.map((req) => {
            const isMet = req.regex.test(password);
            return (
              <div
                key={req.label}
                className={`flex items-center gap-2 text-xs ${
                  isMet ? "text-green-600" : "text-gray-400"
                }`}
              >
                <CheckIcon
                  className={`h-3.5 w-3.5 ${
                    isMet ? "text-green-600" : "text-gray-300"
                  }`}
                />
                <span>{req.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm Password Field */}
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        disabled={loading}
        {...register("confirmPassword")}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={loading}
      >
        Create account
      </Button>

      {/* Terms */}
      <p className="text-center text-xs text-gray-500">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-primary-600 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </Link>
      </p>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </motion.form>
  );
}
