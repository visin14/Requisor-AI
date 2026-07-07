
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ResumeGauge from "@/components/dashboard/ResumeGauge";
import SkillChart from "@/components/dashboard/SkillChart";
import LatestAnalysis from "@/components/dashboard/LatestAnalysis";
import QuickActions from "@/components/dashboard/QuickActions";
import ResumeHistory from "@/components/dashboard/ResumeHistory";
import AIRoadmap from "@/components/dashboard/AIRoadmap";

function CandidateDashboard() {
  return (
    <div className="container mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary text-sm font-mono uppercase tracking-widest">
            Candidate Dashboard
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Welcome back 👋
          </h1>
          <p className="text-gray-500 mt-2">
            Track your resume score, ATS readiness, reports and improvement roadmap.
          </p>
        </div>

        <Link href="/candidate">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-none h-12 px-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze New Resume
          </Button>
        </Link>
      </div>

      <DashboardStats />

      <div className="grid lg:grid-cols-2 gap-6">
        <ResumeGauge />
        <SkillChart />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LatestAnalysis />
        </div>

        <QuickActions />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
  <ResumeHistory />
  <AIRoadmap />
</div>

      <Card className="p-6 rounded-2xl border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">AI Suggestions</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Add more measurable achievements",
            "Improve ATS keywords",
            "Add GitHub or portfolio links",
            "Strengthen professional summary",
          ].map((suggestion) => (
            <div
              key={suggestion}
              className="border border-gray-100 p-4 text-sm text-gray-700 rounded-xl"
            >
              ✅ {suggestion}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default CandidateDashboard;