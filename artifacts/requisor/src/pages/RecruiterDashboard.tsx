import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { ArrowRight, Brain, Briefcase, FileText, Scale, Sparkles, Users } from "lucide-react";
import { Link } from "wouter";

export default function RecruiterDashboard() {
  const { getToken } = useAuth();

  const [statsData, setStatsData] = useState({
    candidates: 0,
    jobDescriptions: 0,
    matches: 0,
    aiDecisions: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = await getToken();

        const res = await fetch("/api/recruiter/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch recruiter stats:", res.status);
          return;
        }

        const data = await res.json();

        setStatsData({
          candidates: data.candidates ?? 0,
          jobDescriptions: data.jobDescriptions ?? 0,
          matches: data.matches ?? 0,
          aiDecisions: data.aiDecisions ?? 0,
        });
      } catch (error) {
        console.error("Failed to load recruiter stats", error);
      }
    }

    fetchStats();
  }, [getToken]);

  const stats = [
    { title: "Candidates", value: statsData.candidates, icon: Users },
    { title: "Job Descriptions", value: statsData.jobDescriptions, icon: Briefcase },
    { title: "Matches", value: statsData.matches, icon: Scale },
    { title: "AI Decisions", value: statsData.aiDecisions, icon: Brain },
  ];

  const actions = [
    {
      title: "Resume + JD Matching",
      description: "Compare candidate resumes with job descriptions and get match scores.",
      href: "/recruiter/match",
      icon: FileText,
    },
    {
      title: "Semantic Resume Matching",
      description: "Analyze deep skill similarity beyond keyword matching.",
      href: "/recruiter/semantic-match",
      icon: Sparkles,
    },
    {
      title: "AI Hiring Decision",
      description: "Generate recommendation, risks, pros, cons and next steps.",
      href: "/recruiter/decision",
      icon: Brain,
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900">Recruiter Dashboard</h1>

      <p className="text-gray-500 mt-2">
        Manage job descriptions, candidates, matches and hiring decisions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-2xl border bg-white p-6 shadow-sm">
              <Icon className="h-7 w-7 text-emerald-500 mb-4" />
              <p className="text-sm text-gray-500">{item.title}</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">{item.value}</h2>
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-12">Recruiter Tools</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} href={item.href}>
              <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition cursor-pointer h-full">
                <Icon className="h-8 w-8 text-emerald-500 mb-5" />
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-500 mt-3">{item.description}</p>

                <div className="flex items-center gap-2 text-emerald-600 font-semibold mt-6">
                  Open Tool <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}