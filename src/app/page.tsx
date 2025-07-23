"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'url("/platform-hero-bg.png") no-repeat center top',
        backgroundSize: "contain",
        backgroundPosition: "center -50px",
      }}
    >
      {/* Background glow orbs */}
      <div className="absolute w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px] top-[-200px] left-[-200px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[120px] top-[-100px] right-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] bottom-[-100px] left-1/2 transform -translate-x-1/2"></div>
      <div className="absolute w-[300px] h-[300px] bg-orange-500/15 rounded-full blur-[80px] top-1/2 right-1/4"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">ClickDown</span>
        </div>

        <nav className="hidden md:flex items-center bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-2 py-1">
          <Link
            href="#dashboard"
            className="bg-gray-800 text-white px-4 py-2 rounded-full transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="#tickets"
            className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-full"
          >
            Tickets
          </Link>
          <Link
            href="#clients"
            className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-full"
          >
            Clients
          </Link>
          <Link
            href="#workload"
            className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-full"
          >
            Workload
          </Link>
          <Link
            href="#pricing"
            className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-full"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                href={
                  user.role === "CLIENT" ? "/client/dashboard" : "/dashboard"
                }
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/auth/login"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Continue
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 lg:px-12 pt-20 pb-32">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Icon */}

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight"
          >
            The only ticket management that{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              works where you work
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Streamline your workflow with our intelligent ticket management
            system. From backlog to completion, manage everything in one place.
          </motion.p>

          {/* Search/Input Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Managing tickets for client projects..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            {user ? (
              <Link
                href={
                  user.role === "CLIENT" ? "/client/dashboard" : "/dashboard"
                }
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2 group"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2 group"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <Link
              href="#demo"
              className="text-gray-300 hover:text-white px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200"
            >
              Watch Demo
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to manage tickets
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From simple task tracking to complex project management, Tuesday
              has you covered with powerful features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Streamlined Workflow",
                description:
                  "5-step process from backlog to completion with intelligent status tracking.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Users,
                title: "Role-Based Access",
                description:
                  "Separate portals for team members and clients with appropriate permissions.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description:
                  "Track progress and performance with live updates and insights.",
                color: "from-purple-500 to-pink-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { number: "5", label: "Status Types" },
              { number: "∞", label: "Unlimited Tickets" },
              { number: "24/7", label: "Access" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Tuesday</span>
          </div>

          <div className="flex items-center space-x-6 text-gray-400">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link
              href="/support"
              className="hover:text-white transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
