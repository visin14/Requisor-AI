import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { FileText, Star, TrendingUp, Clock } from "lucide-react";

interface Stats {
  totalAnalyses: number;
  avgScore: number;
  lastAnalysisDate: string | null;
}

export default function DashboardStats() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalAnalyses: 0,
    avgScore: 0,
    lastAnalysisDate: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await fetch("/api/candidate/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (e) {
        console.error("Failed to load stats", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  const grade =
    stats.avgScore >= 80
      ? "Excellent"
      : stats.avgScore >= 60
        ? "Good"
        : stats.totalAnalyses > 0
          ? "Needs Work"
          : "—";

  const lastDate = stats.lastAnalysisDate
    ? new Date(stats.lastAnalysisDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "None yet";

  const items = [
    { label: "Resumes Analyzed", value: stats.totalAnalyses, icon: FileText },
    {
      label: "Average Score",
      value: stats.avgScore ? `${stats.avgScore}/100` : "—",
      icon: Star,
    },
    { label: "Score Grade", value: grade, icon: TrendingUp },
    { label: "Last Analysis", value: lastDate, icon: Clock },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          >
            <Icon className="h-6 w-6 text-emerald-500 mb-3" />
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? "—" : item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
