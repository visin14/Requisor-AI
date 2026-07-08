import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import { useState, useRef, useCallback } from "react";
import { useAuth } from "@clerk/react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UploadCloud, FileText, CheckCircle2, Target, Code, BookOpen,
  Brain, AlertTriangle, Sparkles, ChevronRight, Loader2, X
} from "lucide-react";

interface ResumeAnalysis {
  overallScore: number;
  name: string;
  title: string;
  summary: string;
  scores: {
    technicalFit: number;
    experienceDepth: number;
    impactMetrics: number;
    communicationClarity: number;
  };
  skills: string[];
  experience: { company: string; role: string; duration: string }[];
  strengths: string[];
  gaps: { severity: "critical" | "moderate" | "minor"; area: string; detail: string }[];
  roadmap: { step: number; action: string; detail: string; timeframe: string }[];
  aiGenerated: boolean;
  aiGeneratedReason: string | null;
}

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth={10} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease, stroke 0.4s" }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fill={color} fontSize={size / 4} fontWeight="bold" fontFamily="monospace"
        style={{ rotate: "90deg", transformBox: "fill-box", transformOrigin: "center" }}>
        {score}
      </text>
      <text x="50%" y="68%" dominantBaseline="middle" textAnchor="middle"
        fill="#9ca3af" fontSize={size / 12} fontFamily="monospace"
        style={{ rotate: "90deg", transformBox: "fill-box", transformOrigin: "center" }}>
        / 100
      </text>
    </svg>
  );
}

function SeverityBadge({ sev }: { sev: string }) {
  const map = { critical: "bg-red-50 border-red-200 text-red-600", moderate: "bg-amber-50 border-amber-200 text-amber-600", minor: "bg-blue-50 border-blue-200 text-blue-600" };
  return <span className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${map[sev as keyof typeof map] ?? map.minor}`}>{sev}</span>;
}

export default function Candidate() {
  const { getToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

 const readFile = useCallback(async (f: File) => {
  setFile(f);
  setAnalysis(null);
  setError(null);

  try {
    // PDF Upload
    if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
      const buffer = await f.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: buffer,
      }).promise;

      let extractedText = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();

        extractedText +=
          content.items
            .map((item: any) => ("str" in item ? item.str : ""))
            .join(" ") + "\n\n";
      }

      setResumeText(extractedText.trim());
      return;
    }

    // TXT / MD / CSV
    const reader = new FileReader();

    reader.onload = (e) => {
      setResumeText((e.target?.result as string) ?? "");
    };

    reader.onerror = () => {
      setError("Unable to read the file.");
    };

    reader.readAsText(f);
  } catch (err) {
    console.error(err);
    setError("Failed to extract text from the uploaded PDF.");
  }
}, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) readFile(f);
  }, [readFile]);

  const analyze = async () => {
    if (!resumeText.trim()) { setError("Could not read file text. Please paste your resume text below."); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json() as ResumeAnalysis;
      setAnalysis(data);
      // Save to database for dashboard history (non-blocking, best-effort)
      try {
        const token = await getToken();
        const saveRes = await fetch("/api/candidate/save-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ resumeTitle: file?.name ?? data.name ?? "Pasted Resume", analysis: data }),
        });
        if (!saveRes.ok) {
          console.warn("Save-analysis responded with", saveRes.status);
        }
      } catch (saveErr) {
        console.warn("Failed to save analysis to history:", saveErr);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setResumeText(""); setAnalysis(null); setError(null); };

  return (
    <div className="container mx-auto px-6 py-12 pb-32">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-mono text-primary uppercase tracking-widest">AI Resume Understanding</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Candidate Portal</h1>
        <p className="text-muted-foreground font-mono text-sm">Upload your resume for multidimensional AI analysis</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── Left: Upload + Score ── */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upload card */}
          <Card className="p-8 bg-white border border-dashed border-primary/30 shadow-sm rounded-none relative overflow-hidden">
            {!file ? (
              <div
                className={`flex flex-col items-center justify-center text-center cursor-pointer group transition-colors ${dragging ? "bg-primary/5" : ""}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Drop Resume Here</h3>
                <p className="text-sm text-muted-foreground mb-4">TXT, PDF text, DOCX text, MD</p>
                <Button size="sm" variant="outline" className="rounded-none border-primary/30 text-primary text-xs">
                  Browse File
                </Button>
                <input ref={inputRef} type="file" accept=".pdf,.txt,.md,.csv,.doc,.docx" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f); }} />
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-medium truncate">{file.name}</h3>
                  <p className="text-sm text-primary flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Ready to analyse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={reset} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </Card>

          {/* Paste fallback */}
          {file && !analysis && (
            <Card className="p-4 bg-white border border-gray-100 shadow-sm rounded-none">
              <p className="text-xs text-muted-foreground mb-2 font-mono">RESUME TEXT (edit/paste if needed)</p>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={6}
                className="w-full text-xs border border-gray-100 rounded-none p-2 resize-none focus:outline-none focus:border-primary/30 font-mono"
                placeholder="Paste resume text here..."
              />
            </Card>
          )}

          {!file && !analysis && (
            <Card className="p-4 bg-white border border-gray-100 shadow-sm rounded-none">
              <p className="text-xs text-muted-foreground mb-2 font-mono">OR PASTE RESUME TEXT DIRECTLY</p>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={8}
                className="w-full text-xs border border-gray-100 rounded-none p-2 resize-none focus:outline-none focus:border-primary/30 font-mono"
                placeholder="Paste your resume text here..."
              />
            </Card>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-none">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {resumeText && !analysis && (
            <Button
              onClick={analyze}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-12 font-medium"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analysing Resume…</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Run AI Analysis</>
              )}
            </Button>
          )}

          {/* Score ring */}
          {analysis && (
            <Card className="p-8 bg-white border border-gray-100 shadow-sm rounded-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/8 blur-[50px]" />
              {analysis.aiGenerated && (
                <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-none">
                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                  <span><strong>AI-Generated Content Detected:</strong> {analysis.aiGeneratedReason}</span>
                </div>
              )}
              <h3 className="text-gray-900 font-medium mb-2">Requisor AI Score</h3>
              <p className="text-xs text-muted-foreground font-mono mb-6">{analysis.name} · {analysis.title}</p>
              <div className="flex justify-center mb-8">
                <ScoreRing score={analysis.overallScore} />
              </div>
              <div className="space-y-3">
                {Object.entries(analysis.scores).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{k.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="text-primary font-mono font-semibold">{v}%</span>
                    </div>
                    <Progress value={v} className="h-1" />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {analysis && (
            <Button onClick={reset} variant="outline" className="w-full rounded-none border-gray-200 text-gray-600 text-sm">
              Analyse Another Resume
            </Button>
          )}
        </div>

        {/* ── Right: Analysis results ── */}
        {loading && (
          <div className="lg:col-span-2 flex flex-col items-center justify-center gap-4 py-24">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            <p className="text-gray-500 font-mono text-sm">AI is reading your resume…</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
              <h2 className="text-sm font-mono text-muted-foreground uppercase mb-3">AI Summary</h2>
              <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {analysis.skills.map((s) => (
                  <Badge key={s} variant="outline" className="rounded-none border-primary/20 text-primary bg-primary/5 font-mono text-[10px]">{s}</Badge>
                ))}
              </div>
            </Card>

            {/* Strengths */}
            <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
              <h2 className="text-sm font-mono text-muted-foreground uppercase mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Strengths
              </h2>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Skill Gaps */}
            <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
              <h2 className="text-sm font-mono text-muted-foreground uppercase mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" /> Skill Gap Analysis
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {analysis.gaps.map((g, i) => (
                  <div key={i} className={`p-4 border rounded-none ${
                    g.severity === "critical" ? "bg-red-50 border-red-100" :
                    g.severity === "moderate" ? "bg-amber-50 border-amber-100" :
                    "bg-blue-50 border-blue-100"
                  }`}>
                    <div className="flex items-center gap-2 mb-2"><SeverityBadge sev={g.severity} /></div>
                    <p className="text-gray-900 font-medium text-sm mb-1">{g.area}</p>
                    <p className="text-gray-500 text-xs">{g.detail}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Experience */}
            {analysis.experience?.length > 0 && (
              <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
                <h2 className="text-sm font-mono text-muted-foreground uppercase mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Experience
                </h2>
                <div className="space-y-3">
                  {analysis.experience.map((ex, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{ex.role}</p>
                        <p className="text-xs text-muted-foreground">{ex.company} · {ex.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Improvement Roadmap */}
            <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
              <h2 className="text-sm font-mono text-muted-foreground uppercase mb-6 flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" /> Improvement Roadmap
              </h2>
              <div className="relative border-l border-primary/20 ml-3 space-y-8 pb-4">
                {analysis.roadmap.map((item, i) => (
                  <div key={i} className="relative pl-8">
                    <div className={`absolute w-3 h-3 rounded-full -left-[6.5px] top-1.5 shadow-sm ${
                      i === 0 ? "bg-primary shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-gray-200"
                    }`} />
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-primary uppercase">Step {item.step} · {item.timeframe}</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{item.action}</h3>
                    <p className="text-xs text-gray-500">{item.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {!analysis && !loading && !resumeText && (
          <div className="lg:col-span-2 flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
              <Brain className="w-10 h-10 text-primary/30" />
            </div>
            <p className="text-gray-400 font-mono text-sm">Upload or paste your resume to begin AI analysis</p>
          </div>
        )}
      </div>
    </div>
  );
}
