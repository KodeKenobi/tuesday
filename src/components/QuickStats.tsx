"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "orange" | "red" | "purple";
  trend?: "up" | "down" | "neutral";
}

const colorClasses = {
  blue: {
    bg: "from-blue-500/10 to-blue-600/10",
    border: "border-blue-500/20",
    icon: "bg-blue-500/20",
    iconColor: "text-blue-400",
    value: "text-blue-300",
    change: "text-blue-400",
  },
  green: {
    bg: "from-green-500/10 to-green-600/10",
    border: "border-green-500/20",
    icon: "bg-green-500/20",
    iconColor: "text-green-400",
    value: "text-green-300",
    change: "text-green-400",
  },
  orange: {
    bg: "from-orange-500/10 to-orange-600/10",
    border: "border-orange-500/20",
    icon: "bg-orange-500/20",
    iconColor: "text-orange-400",
    value: "text-orange-300",
    change: "text-orange-400",
  },
  red: {
    bg: "from-red-500/10 to-red-600/10",
    border: "border-red-500/20",
    icon: "bg-red-500/20",
    iconColor: "text-red-400",
    value: "text-red-300",
    change: "text-red-400",
  },
  purple: {
    bg: "from-purple-500/10 to-purple-600/10",
    border: "border-purple-500/20",
    icon: "bg-purple-500/20",
    iconColor: "text-purple-400",
    value: "text-purple-300",
    change: "text-purple-400",
  },
};

export default function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color,
  trend = "neutral",
}: StatCardProps) {
  const colors = colorClasses[color];

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3" />;
      case "down":
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-br backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:scale-105 card-hover",
        colors.bg,
        colors.border
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={cn("text-sm font-medium", colors.iconColor)}>{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center space-x-1 mt-2">
              <span className={cn("text-xs", colors.change)}>
                {getTrendIcon()}
              </span>
              <span className={cn("text-xs font-medium", colors.change)}>
                {change > 0 ? "+" : ""}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-xs text-gray-400 ml-1">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", colors.icon)}>
          <div className={cn("w-6 h-6", colors.iconColor)}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

interface QuickStatsProps {
  stats: StatCardProps[];
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
