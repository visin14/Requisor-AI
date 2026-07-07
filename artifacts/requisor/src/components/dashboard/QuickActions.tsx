import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Download, Sparkles, Settings } from "lucide-react";

export default function QuickActions() {
  return (
    <Card className="p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="space-y-4">
        <Link href="/candidate">
          <Button className="w-full">
            <Sparkles className="mr-2 w-4 h-4" />
            Analyze Resume
          </Button>
        </Link>

        <Button variant="outline" className="w-full">
          <Download className="mr-2 w-4 h-4" />
          Download Report
        </Button>

        <Button variant="outline" className="w-full">
          <Settings className="mr-2 w-4 h-4" />
          Settings
        </Button>
      </div>
    </Card>
  );
}