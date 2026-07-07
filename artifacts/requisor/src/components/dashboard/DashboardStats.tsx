import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ResumeGauge() {
  const score = 92;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold mb-6">Resume Score</h2>

      <div className="w-52 mx-auto">
        <CircularProgressbar
          value={score}
          text={`${score}`}
          styles={buildStyles({
            pathColor: "#10b981",
            textColor: "#111827",
            trailColor: "#e5e7eb",
          })}
        />
      </div>

      <p className="text-center mt-6 text-emerald-600 font-semibold text-lg">
        Excellent Resume
      </p>
    </motion.div>
  );
}