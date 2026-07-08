import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Analysis {
  id: string;
  resumeTitle: string;
  overallScore: number;
  createdAt: string;
}

export default function ResumeHistory() {
  const { getToken } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await fetch("/api/candidate/analyses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setAnalyses(await res.json());
        }
      } catch (e) {
        console.error("Failed to load history", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  return (
    <Card className="p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Resume History</h2>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : analyses.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No analyses yet. Analyze your first resume!
        </p>
      ) : (
        <div className="space-y-4">
          {analyses.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-3 last:border-none"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-emerald-500 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{item.resumeTitle}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <span className="font-bold text-emerald-600 shrink-0">
                {item.overallScore}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
