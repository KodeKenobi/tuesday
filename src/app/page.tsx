"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Home page - loading:", loading, "user:", user);
    if (!loading) {
      if (user) {
        console.log("User found, redirecting based on role:", user.role);
        // Redirect based on user role
        if (user.role === "CLIENT") {
          router.push("/client/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        console.log("No user found, redirecting to login");
        router.push("/auth/login");
      }
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
      </div>
    );
  }

  return null;
}
