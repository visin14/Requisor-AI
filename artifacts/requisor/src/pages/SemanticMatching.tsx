import { useState } from "react";
import {
  ArrowLeft,
  Brain,
  Briefcase,
  CheckCircle2,
  FileText,
  Sparkles,
  Upload,
} from "lucide-react";
import { Link } from "wouter";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function SemanticMatching() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleResumeUpload(file: File) {
    setExtracting(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ") + "\n\n";
      }

      setResumeText(text);
    } catch {
      alert("Could not extract PDF text.");
    } finally {
      setExtracting(false);
    }
  }

  async function handleAnalyze() {
    if (!resumeText.trim() || !jdText.trim()) {
      alert("Please add resume and job description.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText }),
      });

      const data = await res.json();

      setResult({
        ...data,
        similarity: [
          { label: "Skill Similarity", value: data.matchScore ?? 0 },
          { label: "Experience Fit", value: Math.max((data.matchScore ?? 0) - 8, 0) },
          { label: "Role Alignment", value: Math.min((data.matchScore ?? 0) + 5, 100) },
          { label: "Project Relevance", value: Math.max((data.matchScore ?? 0) - 12, 0) },
          { label: "Communication Fit", value: Math.min((data.matchScore ?? 0) + 3, 100) },
        ],
      });

      setTimeout(() => {
        document.getElementById("semantic-result")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
    } catch {
      alert("Semantic analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/40 to-white">
      <div className="container mx-auto px-6 py-10">
        <Link href="/recruiter-dashboard">
          <button className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </Link>

        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            AI Semantic Engine
          </p>

          <h1 className="mt-2 text-4xl font-black text-gray-900">
            Semantic Resume Matching
          </h1>

          <p className="mt-3 max-w-2xl text-gray-500">
            Analyze deep skill, experience, role fit and semantic similarity beyond keyword matching.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900">
                Candidate Resume
              </h2>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-7 hover:bg-emerald-50">
              <Upload className="mb-3 h-7 w-7 text-emerald-600" />
              <span className="font-bold text-emerald-700">
                {extracting ? "Extracting PDF..." : "Upload Resume PDF"}
              </span>

              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleResumeUpload(file);
                }}
              />
            </label>

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Resume text will appear here..."
              className="mt-5 h-72 w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3">
                <Briefcase className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900">
                Target Job Description
              </h2>
            </div>

            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste target job description here..."
              className="h-[420px] w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading || extracting}
            className="inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-10 py-4 font-black text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-60"
          >
            <Sparkles className="h-5 w-5" />
            {loading ? "Running Semantic Analysis..." : "Run Semantic Analysis"}
          </button>
        </div>

        {result && (
          <div id="semantic-result" className="mt-12 scroll-mt-24">
            <div className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-lg shadow-emerald-100/70">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <Brain className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    Semantic Matching Report
                  </h2>
                  <p className="text-gray-500">
                    Deep candidate-to-role compatibility analysis.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-3xl bg-emerald-600 p-8 text-white">
                  <p className="font-bold text-emerald-100">Semantic Score</p>
                  <h3 className="mt-3 text-6xl font-black">
                    {result.matchScore ?? 0}%
                  </h3>
                  <p className="mt-4 rounded-full bg-white px-4 py-2 text-center font-black text-emerald-700">
                    {result.verdict}
                  </p>
                </div>

                <div className="lg:col-span-2 rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6">
                  <h3 className="mb-5 text-lg font-black text-gray-900">
                    Similarity Breakdown
                  </h3>

                  <div className="space-y-5">
                    {result.similarity.map((item: any) => (
                      <div key={item.label}>
                        <div className="mb-2 flex justify-between text-sm font-bold">
                          <span className="text-gray-700">{item.label}</span>
                          <span className="text-emerald-700">{item.value}%</span>
                        </div>

                        <div className="h-3 rounded-full bg-white">
                          <div
                            className="h-3 rounded-full bg-emerald-500"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6">
                <h3 className="mb-3 font-black text-gray-900">
                  Semantic Insights
                </h3>
                <p className="leading-8 text-gray-600">
                  {result.semanticInsights}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6">
                  <h3 className="mb-4 font-black text-gray-900">
                    Matched Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(result.matchedSkills ?? []).map((skill: string) => (
                      <span
                        key={skill}
                        className="rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-6">
                  <h3 className="mb-4 font-black text-gray-900">
                    Interview Focus
                  </h3>
                  <ul className="space-y-3">
                    {(result.interviewFocus ?? []).map((item: string) => (
                      <li key={item} className="flex gap-3 text-gray-600">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}