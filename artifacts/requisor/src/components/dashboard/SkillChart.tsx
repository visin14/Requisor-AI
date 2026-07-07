import { motion } from "framer-motion";

const skills = [
  { name: "Technical Skills", score: 95 },
  { name: "Experience", score: 90 },
  { name: "Communication", score: 88 },
  { name: "Leadership", score: 82 },
  { name: "Problem Solving", score: 96 },
];

export default function SkillChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Skill Breakdown</h2>

      <div className="space-y-5">
        {skills.map((skill, index) => (
          <div key={skill.name}>
            <div className="flex justify-between mb-2">
              <span>{skill.name}</span>
              <span>{skill.score}%</span>
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
    </div>
  );
}