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
import { useEffect, useState } from "react";
import ScrollHandler from "@/components/ScrollHandler";

export default function LandingPage() {
  const { user } = useAuth();
  const [selectedMenuItem, setSelectedMenuItem] = useState("Dashboard");

  const [cardOrder, setCardOrder] = useState([
    { text: "Managing tickets for client projects", icon: CheckCircle },
    { text: "Real-time collaboration and updates", icon: Users },
    { text: "Progress tracking and analytics", icon: BarChart3 },
    { text: "Custom workflow automation", icon: Zap },
    { text: "Team and client portals", icon: Shield },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCardOrder((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ScrollHandler />
      <motion.div
        className="min-h-screen relative overflow-hidden"
        initial={{
          background: 'url("/platform-hero-bg.png") no-repeat center top',
          backgroundSize: "contain",
          backgroundPosition: "center -50px",
          opacity: 0,
          scale: 1.1,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 3.5,
          delay: 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{
          background: 'url("/platform-hero-bg.png") no-repeat center top',
          backgroundSize: "contain",
          backgroundPosition: "center -50px",
        }}
      >
        {/* Background glow orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px] top-[-200px] left-[-200px]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 3.5,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        ></motion.div>
        <motion.div
          className="absolute w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[120px] top-[-100px] right-[-100px]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 3.5,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        ></motion.div>
        <motion.div
          className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] bottom-[-100px] left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 3.5,
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        ></motion.div>
        <motion.div
          className="absolute w-[300px] h-[300px] bg-orange-500/15 rounded-full blur-[80px] top-1/2 right-1/4"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 3.5,
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        ></motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.5, ease: "easeOut" }}
          className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12"
        >
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.span
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              ClickDown
            </motion.span>
          </motion.div>

          <motion.nav
            className="hidden md:flex items-center bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-2 py-4"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {["Dashboard", "Tickets", "Clients", "Workload", "Pricing"].map(
              (item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <button
                    onClick={() => setSelectedMenuItem(item)}
                    className={`${
                      selectedMenuItem === item
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:text-white"
                    } px-6 py-3 rounded-full transition-colors`}
                  >
                    {item}
                  </button>
                </motion.div>
              )
            )}
          </motion.nav>

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {user ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <Link
                    href={
                      user.role === "CLIENT"
                        ? "/client/dashboard"
                        : "/dashboard"
                    }
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    href="/auth/login"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    Continue
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <Link
                    href="/auth/login"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    href="/auth/signup"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.header>

        {/* Hero Section */}
        <main className="relative z-10 px-6 lg:px-12 pt-34 pb-32">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Icon */}

            {/* Hero Text Container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3.5, delay: 0.2 }}
              className="relative mb-12"
            >
              {/* Horizontal Line Container */}
              <motion.div
                initial={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2rem",
                }}
                animate={{
                  display: "block",
                }}
                transition={{
                  duration: 3.5,
                  delay: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="text-center"
              >
                {/* Main Headline */}
                <motion.h1
                  initial={{
                    opacity: 0,
                    y: 60,
                    scale: 0.95,
                    display: "inline-block",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    display: "block",
                  }}
                  transition={{
                    duration: 1.8,
                    delay: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-none"
                >
                  The only ticket management that{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    works where you work
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -60,
                    filter: "blur(4px)",
                    display: "inline-block",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    display: "block",
                  }}
                  transition={{
                    duration: 1.8,
                    delay: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                  Streamline your workflow with our intelligent ticket
                  management system. From backlog to completion, manage
                  everything in one place.
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Stacked Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative h-80 flex flex-col items-center">
                {cardOrder.map((card, index) => {
                  const IconComponent = card.icon;
                  return (
                    <motion.div
                      key={card.text}
                      initial={{
                        opacity: 0,
                        y: 50,
                        scale: 0.8,
                        rotateX: -15,
                        filter: "blur(4px)",
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotateX: 0,
                        filter: "blur(0px)",
                      }}
                      transition={{
                        duration: 0.8,
                        delay: 0.5 + index * 0.15,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                      }}
                      whileHover={{
                        scale: 1.02,
                        y: -2,
                        transition: { duration: 0.2 },
                      }}
                      className="absolute bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white transition-all duration-500 hover:bg-white/20 hover:border-white/40"
                      style={{
                        width: `${100 - index * 12}%`,
                        height: `${80 - index * 12}px`,
                        top: `${index * 8}%`,
                        zIndex: 5 - index,
                        padding: `${16 - index * 2}px 20px`,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <motion.div
                        className="flex items-center justify-center h-full text-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.8 + index * 0.15,
                          ease: "easeOut",
                        }}
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: 1 + index * 0.15,
                            type: "spring",
                            stiffness: 200,
                          }}
                        >
                          <IconComponent className="text-gray-400 w-5 h-5 mr-3" />
                        </motion.div>
                        <motion.span
                          className="text-sm opacity-90"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 0.9, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 1.2 + index * 0.15,
                            ease: "easeOut",
                          }}
                        >
                          {card.text}
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.8,
                type: "spring",
                stiffness: 100,
              }}
              className="mt-[-80px] flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              {user ? (
                <motion.div
                  initial={{ opacity: 0, x: -30, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={
                      user.role === "CLIENT"
                        ? "/client/dashboard"
                        : "/dashboard"
                    }
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2 group"
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.2 }}
                    >
                      Go to Dashboard
                    </motion.span>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.3 }}
                      whileHover={{ x: 5 }}
                    >
                      <ArrowRight className="w-5 h-5 transition-transform" />
                    </motion.div>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -30, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth/signup"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2 group"
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.2 }}
                    >
                      Start Free Trial
                    </motion.span>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.3 }}
                      whileHover={{ x: 5 }}
                    >
                      <ArrowRight className="w-5 h-5 transition-transform" />
                    </motion.div>
                  </Link>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, x: 30, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1, type: "spring" }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="#demo"
                  className="text-gray-300 hover:text-white px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200"
                >
                  Watch Demo
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </main>

        {/* Features Section */}
        <section
          id="features"
          className="relative z-10 px-6 lg:px-12 py-20 mt-[-100px]"
        >
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
                From simple task tracking to complex project management,
                ClickDown has you covered with powerful features.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 pt-8">
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
                  initial={{ opacity: 0, y: 40, scale: 0.9, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    rotateY: 5,
                    transition: { duration: 0.3 },
                  }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                >
                  <motion.div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.2 + 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-semibold text-white mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    className="text-gray-400 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                  >
                    {feature.description}
                  </motion.p>
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
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <motion.div
                    className="text-4xl font-bold text-white mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.2 + 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    {stat.number}
                  </motion.div>
                  <motion.div
                    className="text-gray-400"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                  >
                    {stat.label}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 px-6 lg:px-12 py-12 border-t border-white/10"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <motion.div
              className="flex items-center space-x-3 mb-4 md:mb-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span
                className="text-xl font-bold text-white"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                ClickDown
              </motion.span>
            </motion.div>

            <motion.div
              className="flex items-center space-x-6 text-gray-400"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {["Privacy", "Terms", "Support"].map((link, index) => (
                <motion.div
                  key={link}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    href={`/${link.toLowerCase()}`}
                    className="hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.footer>
      </motion.div>
    </>
  );
}
