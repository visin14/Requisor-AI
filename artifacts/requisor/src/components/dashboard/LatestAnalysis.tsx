import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

interface Analysis {
  id: string;
  resumeTitle: string;
  overallScore: number;
  createdAt: string;
  summary: string | null;
}

export default function LatestAnalysis() {
  const { getToken } = useAuth();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await fetch("/api/candidate/analyses?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setAnalysis(data[0]);
        }
      } catch (e) {
        console.error("Failed to load latest analysis", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  const parsed = analysis?.summary
    ? (() => {
        try {
          return JSON.parse(analysis.summary);
        } catch {
          return null;
        }
      })()
    : null;

  return (
    <Card className="p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold">Latest Analysis</h2>

          {loading ? (
            <p className="text-gray-400 text-sm mt-4">Loading…</p>
          ) : !analysis ? (
            <div className="mt-4">
              <p className="text-gray-500 text-sm">No analyses yet.</p>
              <Link href="/candidate">
                <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Sparkles className="mr-2 w-4 h-4" />
                  Analyze Your First Resume
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mt-4">
                <FileText className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold">{analysis.resumeTitle}</span>
              </div>

              <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                {new Date(analysis.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-semibold">
                  Score {analysis.overallScore}
                </div>
                {parsed?.scores?.technicalFit != null && (
                  <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold">
                    Tech Fit {parsed.scores.technicalFit}%
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {analysis && (
          <Link href="/resume-history">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0">
              Open
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
