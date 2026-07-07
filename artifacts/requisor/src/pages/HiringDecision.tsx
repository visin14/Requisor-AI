import { useRef, useState } from "react";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  FileText,
  RefreshCw,
  Sparkles,
  Upload,
  ShieldCheck,
  AlertTriangle,
  BadgeCheck,
} from "lucide-react";
import { Link } from "wouter";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function HiringDecision() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const resultRef = useRef<HTMLDivElement | null>(null);

  async function handleResumeUpload(file: File) {
    setExtracting(true);
    setFileName(file.name);

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
      alert("Could not extract text from PDF.");
    } finally {
      setExtracting(false);
    }
  }

  async function handleDecision() {
    if (!resumeText.trim() || !jdText.trim()) {
      alert("Please add both resume and job description.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/ai/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jdText,
          notes,
        }),
      });

      const data = await res.json();
      setResult(data);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 250);
    } catch {
      alert("Hiring decision failed.");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setResumeText("");
    setJdText("");
    setNotes("");
    setFileName("");
    setResult(null);
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

        <h1 className="text-4xl font-black text-gray-900">
          AI Hiring Decision <Sparkles className="inline h-7 w-7 text-emerald-500" />
        </h1>

        <p className="mt-3 max-w-3xl text-gray-500">
          Generate recruiter-level hiring recommendations, confidence score,
          risks, pros, cons and next interview step.
        </p>

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
              <div className="mt-4 rounded-xl border border-emerald-100 bg-white p-4">
                <p className="font-bold text-gray-800">{fileName}</p>
                <p className="text-sm text-emerald-600">
                  Text extracted successfully
                </p>
              </div>
            )}

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste resume text here..."
              className="mt-5 h-64 w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3">
                <Brain className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900">
                Job Description
              </h2>
            </div>

            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste job description here..."
              className="h-64 w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional recruiter notes..."
              className="mt-5 h-32 w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleDecision}
            disabled={loading || extracting}
            className="inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-10 py-4 font-black text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-60"
          >
            <Sparkles className="h-5 w-5" />
            {loading ? "Generating Decision..." : "Generate Hiring Decision"}
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
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-3xl bg-emerald-600 p-8 text-white">
                  <ShieldCheck className="h-10 w-10" />
                  <p className="mt-6 text-sm font-bold text-emerald-100">
                    AI Decision
                  </p>
                  <h2 className="mt-3 text-4xl font-black">
                    {result.decision}
                  </h2>
                  <p className="mt-4 rounded-full bg-white px-4 py-2 text-center font-black text-emerald-700">
                    {result.confidence ?? 0}% Confidence
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6">
                  <BadgeCheck className="mb-4 h-8 w-8 text-emerald-600" />
                  <p className="font-bold text-gray-600">Suggested Next Step</p>
                  <h3 className="mt-3 text-3xl font-black text-gray-900">
                    {result.suggestedNextStep}
                  </h3>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-6">
                  <AlertTriangle className="mb-4 h-8 w-8 text-emerald-600" />
                  <p className="font-bold text-gray-600">Retention Risk</p>
                  <h3 className="mt-3 text-3xl font-black text-gray-900">
                    {result.retentionRisk}
                  </h3>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6">
                <h3 className="mb-3 text-xl font-black text-gray-900">
                  AI Reasoning
                </h3>
                <p className="leading-8 text-gray-600">{result.reasoning}</p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6">
                  <h3 className="mb-4 font-black text-gray-900">Pros</h3>
                  <ul className="space-y-3">
                    {(result.pros ?? []).map((item: string) => (
                      <li key={item} className="flex gap-3 text-gray-700">
                        <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-6">
                  <h3 className="mb-4 font-black text-gray-900">Cons</h3>
                  <ul className="space-y-3">
                    {(result.cons ?? []).map((item: string) => (
                      <li key={item} className="flex gap-3 text-gray-700">
                        <AlertTriangle className="mt-1 h-5 w-5 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-emerald-100 bg-white p-6">
                  <h3 className="mb-3 font-black text-gray-900">
                    Compensation Benchmark
                  </h3>
                  <p className="text-gray-600">
                    {result.compensationBenchmark}
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-6">
                  <h3 className="mb-3 font-black text-gray-900">
                    Retention Risk Reason
                  </h3>
                  <p className="text-gray-600">
                    {result.retentionRiskReason}
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-3xl bg-emerald-600 p-6 text-white">
                <h3 className="mb-4 font-black">Onboarding Needs</h3>
                <div className="flex flex-wrap gap-3">
                  {(result.onboardingNeeds ?? []).map((item: string) => (
                    <span
                      key={item}
                      className="rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}