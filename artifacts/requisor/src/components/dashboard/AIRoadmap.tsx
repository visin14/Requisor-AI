import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { Card } from "@/components/ui/card";

interface RoadmapStep {
  step: number;
  action: string;
  timeframe?: string;
}

export default function AIRoadmap() {
  const { getToken } = useAuth();
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
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
          if (data.length > 0 && data[0].summary) {
            try {
              const analysis = JSON.parse(data[0].summary);
              if (Array.isArray(analysis.roadmap)) {
                setRoadmap(analysis.roadmap);
              }
            } catch {
              // not parseable
            }
          }
        }
      } catch (e) {
        console.error("Failed to load roadmap", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  return (
    <Card className="p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold mb-6">AI Improvement Roadmap</h2>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : roadmap.length === 0 ? (
        <p className="text-gray-400 text-sm">
          Analyze a resume to get your personalized improvement roadmap.
        </p>
      ) : (
        <div className="space-y-4">
          {roadmap.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 text-sm">
                {step.step}
              </div>
              <div className="pt-1">
                <p className="font-medium text-gray-900 text-sm">
                  {step.action}
                </p>
                {step.timeframe && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {step.timeframe}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
