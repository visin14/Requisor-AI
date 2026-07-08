import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Download, Sparkles, History } from "lucide-react";

export default function QuickActions() {
  return (
    <Card className="p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Quick Actions</h2>

      <div className="space-y-4">
        <Link href="/candidate">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            <Sparkles className="mr-2 w-4 h-4" />
            Analyze Resume
          </Button>
        </Link>

        <Link href="/resume-history">
          <Button variant="outline" className="w-full">
            <Download className="mr-2 w-4 h-4" />
            Download Report
          </Button>
        </Link>

        <Link href="/resume-history">
          <Button variant="outline" className="w-full">
            <History className="mr-2 w-4 h-4" />
            View History
          </Button>
        </Link>
      </div>
    </Card>
  );
}
