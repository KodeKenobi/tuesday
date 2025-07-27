"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  Users,
  Calendar,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "CLIENT">("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === "CLIENT") {
        router.replace("/client/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(name, email, password, role);
    } catch (error) {
      console.error("Signup error:", error);
      setError(error instanceof Error ? error.message : "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] relative overflow-hidden">
      {/* Background blur orbs */}
      <div className="absolute w-[400px] h-[400px] bg-pink-500/30 rounded-full blur-[120px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-[120px] bottom-[-100px] right-[-100px]"></div>

      <div className="flex min-h-screen">
        {/* Left side - Clean branding */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-600/10"></div>
          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-16"
            >
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-5xl font-bold mb-4 tracking-tight"
              >
                ClickDown
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="text-xl text-gray-300 font-medium"
              >
                Simple ticket management for modern teams
              </motion.p>
            </motion.div>

            {/* Clean feature list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, x: -30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                className="flex items-start space-x-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.8,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <CheckCircle className="w-5 h-5 text-pink-400" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
                >
                  <h3 className="font-semibold text-lg mb-2">
                    Streamlined Workflow
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Manage tickets with a simple 5-step process from backlog to
                    completion
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
                className="flex items-start space-x-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.0,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <Users className="w-5 h-5 text-purple-400" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
                >
                  <h3 className="font-semibold text-lg mb-2">
                    Role-Based Access
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Separate portals for team members and clients with
                    appropriate permissions
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 1.0, ease: "easeOut" }}
                className="flex items-start space-x-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
                >
                  <h3 className="font-semibold text-lg mb-2">
                    Real-time Updates
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Track progress and status changes instantly across your team
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Stats or social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 pt-8 border-t border-white/10"
            >
              <div className="flex space-x-8">
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.6,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.8,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="text-2xl font-bold text-white"
                  >
                    5
                  </motion.div>
                  <div className="text-sm text-gray-400">Status Types</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.8,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 2.0,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="text-2xl font-bold text-white"
                  >
                    ∞
                  </motion.div>
                  <div className="text-sm text-gray-400">Unlimited Tickets</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 2.0,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 2.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="text-2xl font-bold text-white"
                  >
                    24/7
                  </motion.div>
                  <div className="text-sm text-gray-400">Access</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12 py-12">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">ClickDown</h1>
            <p className="text-gray-300 text-lg">Create your account</p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50, y: 30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-10"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                className="text-4xl font-bold text-white tracking-tight"
              >
                Join ClickDown
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                className="mt-2 text-gray-300 text-lg"
              >
                Create your account
              </motion.p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -40, y: 15 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
              >
                <motion.label
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Full Name
                </motion.label>
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="relative"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </motion.div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:border-pink-400 focus:ring-2 focus:ring-pink-500 outline-none transition text-base"
                    placeholder="Enter your full name"
                    required
                  />
                </motion.div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: 40, y: 15 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <motion.label
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Email
                </motion.label>
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="relative"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.3 }}
                  >
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </motion.div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:border-pink-400 focus:ring-2 focus:ring-pink-500 outline-none transition text-base"
                    placeholder="you@example.com"
                    required
                  />
                </motion.div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -40, y: 15 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
              >
                <motion.label
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Password
                </motion.label>
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="relative"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.5,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </motion.div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:border-pink-400 focus:ring-2 focus:ring-pink-500 outline-none transition text-base"
                    placeholder="••••••••"
                    required
                  />
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.6,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200,
                    }}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Role Selection */}
              <motion.div
                initial={{ opacity: 0, x: 40, y: 15 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <motion.label
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Account Type
                </motion.label>
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.55,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200,
                    }}
                    type="button"
                    onClick={() => setRole("USER")}
                    className={cn(
                      "py-3 px-4 rounded-xl border transition-all duration-200 text-sm font-medium",
                      role === "USER"
                        ? "bg-pink-500 border-pink-500 text-white shadow-lg"
                        : "bg-white/20 border-white/20 text-gray-300 hover:border-pink-400 hover:bg-white/30"
                    )}
                  >
                    User
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.65,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200,
                    }}
                    type="button"
                    onClick={() => setRole("CLIENT")}
                    className={cn(
                      "py-3 px-4 rounded-xl border transition-all duration-200 text-sm font-medium",
                      role === "CLIENT"
                        ? "bg-pink-500 border-pink-500 text-white shadow-lg"
                        : "bg-white/20 border-white/20 text-gray-300 hover:border-pink-400 hover:bg-white/30"
                    )}
                  >
                    Client
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-base font-medium rounded-xl shadow-lg hover:from-pink-600 hover:to-purple-700 transition flex items-center justify-center gap-2",
                  loading && "opacity-70 cursor-not-allowed"
                )}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "Creating account..." : "Create Account"}
              </motion.button>
            </form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-300 text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-pink-400 hover:text-pink-300 font-medium"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
