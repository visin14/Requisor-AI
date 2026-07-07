import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function LatestAnalysis() {
  return (
    <Card className="p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">Latest Analysis</h2>

          <div className="flex items-center gap-2 mt-4">
            <FileText className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold">
              Software Engineer Resume.pdf
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
            <Calendar className="w-4 h-4" />
            Today • 3:20 PM
          </div>

          <div className="mt-6 flex gap-3">
            <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-semibold">
              Resume Score 92
            </div>

            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold">
              ATS 95%
            </div>
          </div>
        </div>

       <Link href="/resume-history">
  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
    Open
    <ArrowRight className="ml-2 w-4 h-4" />
  </Button>
</Link>
      </div>
    </Card>
  );
}