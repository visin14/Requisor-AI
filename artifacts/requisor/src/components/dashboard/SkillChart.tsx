import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { API_BASE } from "@/lib/api";
import { motion } from "framer-motion";

interface Skill {
  name: string;
  score: number;
}

export default function SkillChart() {
  const { getToken } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/candidate/analyses?limit=1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0 && data[0].summary) {
            try {
              const analysis = JSON.parse(data[0].summary);
              if (analysis.scores) {
                setSkills([
                  {
                    name: "Technical Fit",
                    score: analysis.scores.technicalFit ?? 0,
                  },
                  {
                    name: "Experience Depth",
                    score: analysis.scores.experienceDepth ?? 0,
                  },
                  {
                    name: "Impact Metrics",
                    score: analysis.scores.impactMetrics ?? 0,
                  },
                  {
                    name: "Communication",
                    score: analysis.scores.communicationClarity ?? 0,
                  },
                ]);
              }
            } catch {
              // summary not parseable
            }
          }
        }
      } catch (e) {
        console.error("Failed to load skill chart", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Skill Breakdown</h2>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : skills.length === 0 ? (
        <p className="text-gray-400 text-sm">
          Analyze a resume to see your skill breakdown.
        </p>
      ) : (
        <div className="space-y-5">
          {skills.map((skill, index) => (
            <div key={skill.name}>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">{skill.name}</span>
                <span className="text-sm font-semibold text-emerald-600">
                  {skill.score}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.score}%` }}
                  transition={{ delay: index * 0.15, duration: 0.7 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
