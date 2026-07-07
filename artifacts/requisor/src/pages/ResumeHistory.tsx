import { ArrowLeft, Calendar, Download, FileText, Search } from "lucide-react";
import { Link } from "wouter";

export default function ResumeHistory() {
  const resumes = [
    {
      name: "Software Engineer Resume.pdf",
      date: "Today • 3:20 PM",
      resumeScore: 92,
      atsScore: 95,
      status: "Excellent Resume",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <Link href="/candidate-dashboard">
        <button className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </Link>

      <h1 className="text-4xl font-black text-gray-900">Resume History</h1>

      <p className="mt-2 text-gray-500">
        View your previously analyzed resumes and reports.
      </p>

      <div className="mt-8 flex items-center gap-3 rounded-2xl border bg-white px-5 py-4 shadow-sm">
        <Search className="h-5 w-5 text-emerald-500" />
        <input
          placeholder="Search resume reports..."
          className="w-full outline-none"
        />
      </div>

      <div className="mt-8 grid gap-5">
        {resumes.map((resume) => (
          <div
            key={resume.name}
            className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-emerald-500" />
                  <h2 className="text-xl font-black text-gray-900">
                    {resume.name}
                  </h2>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {resume.date}
                </div>

                <p className="mt-4 font-bold text-emerald-600">
                  {resume.status}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-xl bg-emerald-50 px-5 py-3 font-bold text-emerald-700">
                  Resume Score {resume.resumeScore}
                </div>

                <div className="rounded-xl bg-emerald-50 px-5 py-3 font-bold text-emerald-700">
                  ATS {resume.atsScore}%
                </div>

                <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}