import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

const history = [
  { file: "Software_Engineer.pdf", score: 92, date: "Today" },
  { file: "Frontend_Resume.pdf", score: 88, date: "Yesterday" },
  { file: "Google_Resume.pdf", score: 95, date: "3 Jul" },
];

export default function ResumeHistory() {
  return (
    <Card className="p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold mb-6">
        Resume History
      </h2>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.file}
            className="flex justify-between items-center border-b pb-3 last:border-none"
          >
            <div className="flex items-center gap-3">
              <FileText className="text-emerald-500" />
              <div>
                <p className="font-semibold">{item.file}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            </div>

            <span className="font-bold text-primary">
              {item.score}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}