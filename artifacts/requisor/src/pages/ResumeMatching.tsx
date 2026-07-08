import { useRef, useState } from "react";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  FileText,
  RefreshCw,
  Scale,
  Upload,
  XCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { useAuth } from "@clerk/react";



pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function ResumeMatching() {
    const { getToken } = useAuth();
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [fileName, setFileName] = useState("");

  const resultRef = useRef<HTMLDivElement | null>(null);

  async function handleResumeUpload(file: File) {
    setExtracting(true);
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const pageText = content.items
          .map((item: any) => item.str)
          .join(" ");

        text += pageText + "\n\n";
      }

      setResumeText(text);
    } catch {
      alert("Could not extract text from PDF.");
    } finally {
      setExtracting(false);
    }
  }

  async function handleAnalyze() {
    if (!resumeText.trim() || !jdText.trim()) {
      alert("Please add both resume and job description.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText, jdText }),
      });

      const data = await res.json();
      setResult(data);

      try {
        const token = await getToken();
        await fetch("/api/recruiter/save-match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ resumeText, jdText, result: data }),
        });
      } catch (saveErr) {
        console.warn("Failed to save match result", saveErr);
      }

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 250);
    } catch {
      alert("Matching failed.");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setResumeText("");
    setJdText("");
    setResult(null);
    setFileName("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white">
      <div className="container mx-auto px-6 py-10">
        <Link href="/recruiter-dashboard">
          <button className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </Link>

        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-black text-gray-900">
            Resume + JD Matching <Sparkles className="inline h-7 w-7 text-emerald-500" />
          </h1>

          <p className="text-gray-500">
            Upload a candidate resume and compare it with a job description using AI.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900">
                Candidate Resume
              </h2>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-7 text-center hover:bg-emerald-50">
              <Upload className="mb-3 h-7 w-7 text-emerald-600" />
              <span className="font-bold text-emerald-700">
                {extracting ? "Extracting PDF..." : "Upload Resume PDF"}
              </span>
              <span className="mt-1 text-sm text-gray-500">
                or paste resume text below
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

            {fileName && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-4">
                <div>
                  <p className="font-bold text-gray-800">{fileName}</p>
                  <p className="text-sm text-emerald-600">Text extracted successfully</p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
            )}

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste resume text here..."
              className="mt-5 h-72 w-full rounded-2xl border border-gray-200 bg-white p-4 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3">
                <Scale className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900">
                Job Description
              </h2>
            </div>

            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste job description here..."
              className="h-[455px] w-full rounded-2xl border border-gray-200 bg-white p-4 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || extracting}
            className="inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-10 py-4 font-black text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:opacity-60"
          >
            <Sparkles className="h-5 w-5" />
            {loading ? "Analyzing Candidate..." : "Analyze Candidate"}
          </button>

          <button
            onClick={clearAll}
            className="inline-flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-8 py-4 font-bold text-emerald-700 hover:bg-emerald-50"
          >
            <RefreshCw className="h-5 w-5" />
            Clear All
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="mt-12 scroll-mt-24">
            <div className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-lg shadow-emerald-100/60">
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-3">
                  <Brain className="h-7 w-7 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">
                  AI Matching Result
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <div className="rounded-3xl bg-emerald-50 p-8 text-center">
                  <p className="text-sm font-bold text-emerald-700">
                    Overall Score
                  </p>
                  <h3 className="mt-3 text-6xl font-black text-emerald-600">
                    {result.matchScore ?? 0}%
                  </h3>
                  <p className="mt-4 rounded-full bg-white px-4 py-2 font-black text-emerald-700">
                    {result.verdict}
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-6">
                  <CheckCircle2 className="mb-4 h-8 w-8 text-emerald-500" />
                  <p className="font-bold text-gray-600">Matched Skills</p>
                  <h3 className="mt-2 text-4xl font-black text-gray-900">
                    {(result.matchedSkills ?? []).length}
                  </h3>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-6">
                  <XCircle className="mb-4 h-8 w-8 text-emerald-500" />
                  <p className="font-bold text-gray-600">Missing Skills</p>
                  <h3 className="mt-2 text-4xl font-black text-gray-900">
                    {(result.missingSkills ?? []).length}
                  </h3>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-6">
                  <Scale className="mb-4 h-8 w-8 text-emerald-500" />
                  <p className="font-bold text-gray-600">Hiring Risk</p>
                  <h3 className="mt-2 text-3xl font-black text-gray-900">
                    {result.hiringRisk ?? "N/A"}
                  </h3>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6">
                  <h4 className="mb-4 font-black text-gray-900">
                    Matched Skills
                  </h4>
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
                  <h4 className="mb-4 font-black text-gray-900">
                    Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(result.missingSkills ?? []).map((skill: string) => (
                      <span
                        key={skill}
                        className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6">
                <h4 className="mb-3 font-black text-gray-900">
                  Semantic Insights
                </h4>
                <p className="leading-8 text-gray-600">
                  {result.semanticInsights}
                </p>
              </div>

              <div className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6">
                <h4 className="mb-4 font-black text-gray-900">
                  Interview Focus
                </h4>
                <ul className="space-y-3">
                  {(result.interviewFocus ?? []).map((item: string) => (
                    <li key={item} className="flex gap-3 text-gray-600">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 rounded-3xl bg-emerald-600 p-6 text-white">
                <h4 className="mb-2 font-black">Hiring Risk Reason</h4>
                <p className="leading-7 text-emerald-50">
                  {result.hiringRiskReason}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}