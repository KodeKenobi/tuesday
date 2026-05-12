"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";

type Milestone = {
  id: string;
  title: string;
  dueDate: string | null;
  completedAt: string | null;
};

type ProjectDetail = {
  id: string;
  name: string;
  description: string | null;
  progress: number;
  health: string;
  status: string;
  team: { id: string; name: string };
  milestones: Milestone[];
};

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user || user.role === "CLIENT") return;
    void (async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Not found");
        setProject(await res.json());
      } catch {
        setError("Could not load project.");
      }
    })();
  }, [authLoading, user, id]);

  const toggleMilestone = async (m: Milestone) => {
    const res = await fetch(`/api/milestones/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !m.completedAt }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setProject((p) =>
      p
        ? {
            ...p,
            milestones: p.milestones.map((x) =>
              x.id === updated.id ? updated : x,
            ),
          }
        : p,
    );
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (user.role === "CLIENT") {
    return (
      <DashboardLayout>
        <p className="text-gray-600">Unavailable.</p>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <p className="text-gray-600">{error || "Loading…"}</p>
        <Link href="/projects" className="mt-4 text-indigo-600">
          Back to projects
        </Link>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href="/projects" className="text-sm text-indigo-600">
          ← Projects
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {project.name}
          </h1>
          <p className="text-gray-500">{project.team.name}</p>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full bg-indigo-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Milestones
          </h2>
          <ul className="mt-3 space-y-2">
            {project.milestones.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700"
              >
                <span
                  className={
                    m.completedAt ? "text-gray-400 line-through" : "text-gray-900 dark:text-white"
                  }
                >
                  {m.title}
                </span>
                <button
                  type="button"
                  onClick={() => toggleMilestone(m)}
                  className="text-sm text-indigo-600"
                >
                  {m.completedAt ? "Reopen" : "Complete"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
