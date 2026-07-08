import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { API_BASE } from "@/lib/api";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ResumeGauge() {
  const { getToken } = useAuth();
  const [score, setScore] = useState(0);
  const [label, setLabel] = useState("No analysis yet");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/candidate/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const s = data.avgScore ?? 0;
          setScore(s);
          setLabel(
            s >= 80
              ? "Excellent Resume"
              : s >= 60
                ? "Good Resume"
                : data.totalAnalyses > 0
                  ? "Needs Improvement"
                  : "No analysis yet",
          );
        }
      } catch (e) {
        console.error("Failed to load gauge", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold mb-6">Resume Score</h2>

      {loading ? (
        <div className="w-52 mx-auto flex items-center justify-center h-52">
          <p className="text-gray-400 text-sm">Loading…</p>
        </div>
      ) : (
        <div className="w-52 mx-auto">
          <CircularProgressbar
            value={score}
            text={score > 0 ? `${score}` : "—"}
            styles={buildStyles({
              pathColor: "#10b981",
              textColor: "#111827",
              trailColor: "#e5e7eb",
            })}
          />
        </div>
      )}

      <p className="text-center mt-6 text-emerald-600 font-semibold text-lg">
        {label}
      </p>
    </motion.div>
  );
}
