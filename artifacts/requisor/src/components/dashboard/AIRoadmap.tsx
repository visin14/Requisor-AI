import { Card } from "@/components/ui/card";

const roadmap = [
  "Improve ATS keywords",
  "Add measurable achievements",
  "Include GitHub projects",
  "Strengthen professional summary",
];

export default function AIRoadmap() {
  return (
    <Card className="p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold mb-6">
        AI Improvement Roadmap
      </h2>

      <div className="space-y-4">
        {roadmap.map((step, i) => (
          <div key={step} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
              {i + 1}
            </div>

            <div className="pt-1">
              {step}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}