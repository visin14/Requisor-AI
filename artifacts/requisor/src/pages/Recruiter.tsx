import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Search, Sparkles, AlertTriangle, Loader2, Brain,
  CheckCircle2, XCircle, ChevronRight, Target, Lightbulb,
  BarChart2, FileText, Cpu, Scale
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

interface JDAnalysis {
  role: string;
  seniority: string;
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  keyResponsibilities: string[];
  redFlags: string[];
  salarySignals: string | null;
  companyCulture: string;
  difficultyScore: number;
  summary: string;
}

interface MatchResult {
  matchScore: number;
  verdict: string;
  matchedSkills: string[];
  missingSkills: string[];
  semanticInsights: string;
  interviewFocus: string[];
  hiringRisk: string;
  hiringRiskReason: string;
}

interface DecisionResult {
  decision: string;
  confidence: number;
  reasoning: string;
  pros: string[];
  cons: string[];
  suggestedNextStep: string;
  compensationBenchmark: string;
  onboardingNeeds: string[];
  retentionRisk: string;
  retentionRiskReason: string;
}

type Tab = "jd" | "match" | "decision";

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "border-primary/40 text-primary bg-primary/8" :
    score >= 60 ? "border-amber-300 text-amber-600 bg-amber-50" :
    "border-gray-200 text-gray-400 bg-gray-50";
  return (
    <div className={`w-10 h-10 flex items-center justify-center font-mono font-bold text-sm border ${color}`}>
      {score}
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, string> = {
    Low: "border-primary/30 text-primary bg-primary/5",
    Medium: "border-amber-300 text-amber-600 bg-amber-50",
    High: "border-red-200 text-red-600 bg-red-50",
  };
  return (
    <Badge variant="outline" className={`rounded-none font-mono text-[10px] uppercase ${map[risk] ?? map.Medium}`}>
      {risk}
    </Badge>
  );
}

function DecisionColor(d: string) {
  if (d?.includes("Strongly Recommend")) return "text-primary";
  if (d?.includes("Recommend")) return "text-emerald-600";
  if (d === "Maybe") return "text-amber-600";
  return "text-red-500";
}

export default function Recruiter() {
  const [activeTab, setActiveTab] = useState<Tab>("jd");
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [recruiterNotes, setRecruiterNotes] = useState("");

  const [jdLoading, setJdLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [decisionLoading, setDecisionLoading] = useState(false);

  const [jdAnalysis, setJdAnalysis] = useState<JDAnalysis | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeJD = async () => {
    if (!jdText.trim()) return;
    setJdLoading(true); setError(null);
    try {
      const res = await fetch("/api/ai/analyze-jd", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jdText }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setJdAnalysis(await res.json() as JDAnalysis);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setJdLoading(false); }
  };

  const runMatch = async () => {
    if (!resumeText.trim() || !jdText.trim()) { setError("Both resume and job description are required for matching."); return; }
    setMatchLoading(true); setError(null);
    try {
      const res = await fetch("/api/ai/match", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setMatchResult(await res.json() as MatchResult);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setMatchLoading(false); }
  };

  const runDecision = async () => {
    if (!resumeText.trim() || !jdText.trim()) { setError("Both resume and job description are required."); return; }
    setDecisionLoading(true); setError(null);
    try {
      const res = await fetch("/api/ai/decision", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText, matchScore: matchResult?.matchScore, notes: recruiterNotes }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setDecisionResult(await res.json() as DecisionResult);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setDecisionLoading(false); }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "jd",       label: "JD Intelligence",     icon: <FileText className="w-4 h-4" /> },
    { id: "match",    label: "Semantic Matching",    icon: <Target className="w-4 h-4" /> },
    { id: "decision", label: "Hiring Decision",      icon: <Scale className="w-4 h-4" /> },
  ];

  const diffChartData = jdAnalysis ? [
    { label: "Difficulty", value: jdAnalysis.difficultyScore },
  ] : [];

  return (
    <div className="container mx-auto px-6 py-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Recruiter Command Center</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">AI Hiring Suite</h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">JD Intelligence · Semantic Matching · Decision Engine</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-0 mb-8 border-b border-gray-100">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.id
                ? "border-primary text-primary bg-primary/3"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 mb-6 bg-red-50 border border-red-100 text-red-600 text-sm rounded-none">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ══ TAB: JD Intelligence ══ */}
      {activeTab === "jd" && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
              <h2 className="text-sm font-mono text-muted-foreground uppercase mb-4">Paste Job Description</h2>
              <Textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={14}
                className="rounded-none border-gray-100 font-mono text-xs resize-none focus-visible:ring-primary/30"
                placeholder="Paste the full job description here…"
              />
              <Button
                onClick={analyzeJD}
                disabled={jdLoading || !jdText.trim()}
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-white rounded-none h-11"
              >
                {jdLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analysing JD…</> : <><Brain className="w-4 h-4 mr-2" /> Analyse Job Description</>}
              </Button>
            </Card>
          </div>

          <div className="space-y-4">
            {jdLoading && (
              <div className="flex flex-col items-center justify-center gap-4 py-24">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                </div>
                <p className="text-gray-400 font-mono text-sm">Reading JD…</p>
              </div>
            )}

            {!jdAnalysis && !jdLoading && (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                  <Search className="w-8 h-8 text-primary/30" />
                </div>
                <p className="text-gray-400 font-mono text-sm">Paste a JD and run analysis</p>
              </div>
            )}

            {jdAnalysis && !jdLoading && (
              <>
                <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{jdAnalysis.role}</h3>
                      <Badge variant="outline" className="mt-1 rounded-none font-mono text-[10px] border-primary/30 text-primary bg-primary/5">{jdAnalysis.seniority}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-mono mb-1">FILL DIFFICULTY</p>
                      <div className="flex items-center gap-2">
                        <div className={`text-2xl font-bold font-mono ${jdAnalysis.difficultyScore >= 70 ? "text-red-500" : jdAnalysis.difficultyScore >= 50 ? "text-amber-500" : "text-primary"}`}>
                          {jdAnalysis.difficultyScore}
                        </div>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{jdAnalysis.summary}</p>
                  {jdAnalysis.salarySignals && (
                    <p className="mt-3 text-xs font-mono text-muted-foreground">💰 {jdAnalysis.salarySignals}</p>
                  )}
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-white border border-gray-100 shadow-sm rounded-none">
                    <h4 className="text-xs font-mono text-muted-foreground uppercase mb-3">Must Have</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {jdAnalysis.mustHaveSkills.map((s) => (
                        <Badge key={s} variant="outline" className="rounded-none font-mono text-[10px] border-red-200 text-red-600 bg-red-50">{s}</Badge>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4 bg-white border border-gray-100 shadow-sm rounded-none">
                    <h4 className="text-xs font-mono text-muted-foreground uppercase mb-3">Nice to Have</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {jdAnalysis.niceToHaveSkills.map((s) => (
                        <Badge key={s} variant="outline" className="rounded-none font-mono text-[10px] border-primary/20 text-primary bg-primary/5">{s}</Badge>
                      ))}
                    </div>
                  </Card>
                </div>

                <Card className="p-4 bg-white border border-gray-100 shadow-sm rounded-none">
                  <h4 className="text-xs font-mono text-muted-foreground uppercase mb-3">Key Responsibilities</h4>
                  <ul className="space-y-1.5">
                    {jdAnalysis.keyResponsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <ChevronRight className="w-3 h-3 text-primary mt-0.5 shrink-0" /> {r}
                      </li>
                    ))}
                  </ul>
                </Card>

                {jdAnalysis.redFlags.length > 0 && (
                  <Card className="p-4 bg-amber-50 border border-amber-100 shadow-sm rounded-none">
                    <h4 className="text-xs font-mono text-amber-600 uppercase mb-3 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Red Flags
                    </h4>
                    <ul className="space-y-1.5">
                      {jdAnalysis.redFlags.map((f, i) => (
                        <li key={i} className="text-xs text-amber-700">• {f}</li>
                      ))}
                    </ul>
                  </Card>
                )}

                <Card className="p-4 bg-white border border-gray-100 shadow-sm rounded-none">
                  <h4 className="text-xs font-mono text-muted-foreground uppercase mb-2">Culture Signals</h4>
                  <p className="text-xs text-gray-600">{jdAnalysis.companyCulture}</p>
                </Card>

                <Button
                  onClick={() => setActiveTab("match")}
                  variant="outline"
                  className="w-full rounded-none border-primary/30 text-primary"
                >
                  <Target className="w-4 h-4 mr-2" /> Continue to Semantic Matching →
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══ TAB: Semantic Matching ══ */}
      {activeTab === "match" && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
              <h2 className="text-sm font-mono text-muted-foreground uppercase mb-4">Job Description</h2>
              <Textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={8}
                className="rounded-none border-gray-100 font-mono text-xs resize-none focus-visible:ring-primary/30"
                placeholder="Paste job description…"
              />
            </Card>
            <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
              <h2 className="text-sm font-mono text-muted-foreground uppercase mb-4">Candidate Resume</h2>
              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={8}
                className="rounded-none border-gray-100 font-mono text-xs resize-none focus-visible:ring-primary/30"
                placeholder="Paste candidate resume…"
              />
            </Card>
            <Button
              onClick={runMatch}
              disabled={matchLoading || !jdText.trim() || !resumeText.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-11"
            >
              {matchLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Matching…</> : <><Sparkles className="w-4 h-4 mr-2" /> Run Semantic Match</>}
            </Button>
          </div>

          <div className="space-y-4">
            {matchLoading && (
              <div className="flex flex-col items-center justify-center gap-4 py-24">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                </div>
                <p className="text-gray-400 font-mono text-sm">Semantic analysis in progress…</p>
              </div>
            )}

            {!matchResult && !matchLoading && (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary/30" />
                </div>
                <p className="text-gray-400 font-mono text-sm">Paste both texts and run match</p>
              </div>
            )}

            {matchResult && !matchLoading && (
              <>
                <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/6 blur-[60px]" />
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Match Result</h3>
                    <RiskBadge risk={matchResult.hiringRisk} />
                  </div>
                  <div className="flex items-end gap-4 mb-4">
                    <div className="text-6xl font-bold font-mono text-primary">{matchResult.matchScore}</div>
                    <div className="pb-2">
                      <div className="text-sm text-muted-foreground">/100 match score</div>
                      <Badge variant="outline" className="mt-1 rounded-none font-mono text-[10px] border-primary/30 text-primary bg-primary/5">
                        {matchResult.verdict}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-none mb-4">
                    <div
                      className="h-2 bg-primary transition-all duration-700"
                      style={{ width: `${matchResult.matchScore}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{matchResult.semanticInsights}</p>
                  <p className="mt-3 text-xs text-muted-foreground font-mono">{matchResult.hiringRiskReason}</p>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-white border border-gray-100 shadow-sm rounded-none">
                    <h4 className="text-xs font-mono text-primary uppercase mb-3 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Matched Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.matchedSkills.map((s) => (
                        <Badge key={s} variant="outline" className="rounded-none font-mono text-[10px] border-primary/20 text-primary bg-primary/5">{s}</Badge>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4 bg-white border border-gray-100 shadow-sm rounded-none">
                    <h4 className="text-xs font-mono text-red-500 uppercase mb-3 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.missingSkills.map((s) => (
                        <Badge key={s} variant="outline" className="rounded-none font-mono text-[10px] border-red-200 text-red-600 bg-red-50">{s}</Badge>
                      ))}
                    </div>
                  </Card>
                </div>

                <Card className="p-4 bg-white border border-gray-100 shadow-sm rounded-none">
                  <h4 className="text-xs font-mono text-muted-foreground uppercase mb-3 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" /> Suggested Interview Focus
                  </h4>
                  <ol className="space-y-2">
                    {matchResult.interviewFocus.map((q, i) => (
                      <li key={i} className="flex gap-2 text-xs text-gray-700">
                        <span className="font-mono text-primary shrink-0">{i + 1}.</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ol>
                </Card>

                <Button
                  onClick={() => setActiveTab("decision")}
                  variant="outline"
                  className="w-full rounded-none border-primary/30 text-primary"
                >
                  <Scale className="w-4 h-4 mr-2" /> Continue to Hiring Decision →
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══ TAB: Hiring Decision Engine ══ */}
      {activeTab === "decision" && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
              <h2 className="text-sm font-mono text-muted-foreground uppercase mb-4">Job Description</h2>
              <Textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={6}
                className="rounded-none border-gray-100 font-mono text-xs resize-none"
                placeholder="Paste job description…"
              />
            </Card>
            <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
              <h2 className="text-sm font-mono text-muted-foreground uppercase mb-4">Candidate Resume</h2>
              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={6}
                className="rounded-none border-gray-100 font-mono text-xs resize-none"
                placeholder="Paste candidate resume…"
              />
            </Card>
            <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
              <h2 className="text-sm font-mono text-muted-foreground uppercase mb-4">Recruiter Notes (Optional)</h2>
              <Textarea
                value={recruiterNotes}
                onChange={(e) => setRecruiterNotes(e.target.value)}
                rows={3}
                className="rounded-none border-gray-100 font-mono text-xs resize-none"
                placeholder="Any observations from screening calls, culture notes, team fit signals…"
              />
              {matchResult && (
                <p className="mt-3 text-xs text-muted-foreground font-mono">
                  Semantic match score: <span className="text-primary">{matchResult.matchScore}/100 — {matchResult.verdict}</span> (auto-included)
                </p>
              )}
            </Card>
            <Button
              onClick={runDecision}
              disabled={decisionLoading || !jdText.trim() || !resumeText.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-11"
            >
              {decisionLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Decision…</> : <><Scale className="w-4 h-4 mr-2" /> Run Hiring Decision Engine</>}
            </Button>
          </div>

          <div className="space-y-4">
            {decisionLoading && (
              <div className="flex flex-col items-center justify-center gap-4 py-24">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                </div>
                <p className="text-gray-400 font-mono text-sm">Decision engine thinking…</p>
              </div>
            )}

            {!decisionResult && !decisionLoading && (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                  <Scale className="w-8 h-8 text-primary/30" />
                </div>
                <p className="text-gray-400 font-mono text-sm">Fill in the details and run the engine</p>
              </div>
            )}

            {decisionResult && !decisionLoading && (
              <>
                {/* Main decision card */}
                <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[80px]" />
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900">AI Hiring Decision</h3>
                    <div className="text-right">
                      <span className="text-xs font-mono text-muted-foreground">CONFIDENCE</span>
                      <div className="font-bold font-mono text-primary text-lg">{decisionResult.confidence}%</div>
                    </div>
                  </div>
                  <div className={`text-3xl font-bold mb-4 ${DecisionColor(decisionResult.decision)}`}>
                    {decisionResult.decision}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{decisionResult.reasoning}</p>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="rounded-none font-mono text-[10px] border-primary/30 text-primary bg-primary/5">
                      Next: {decisionResult.suggestedNextStep}
                    </Badge>
                    <RiskBadge risk={decisionResult.retentionRisk} />
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-primary/3 border border-primary/15 shadow-sm rounded-none">
                    <h4 className="text-xs font-mono text-primary uppercase mb-3 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Pros
                    </h4>
                    <ul className="space-y-1.5">
                      {decisionResult.pros.map((p, i) => (
                        <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                          <span className="text-primary shrink-0">+</span> {p}
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card className="p-4 bg-red-50 border border-red-100 shadow-sm rounded-none">
                    <h4 className="text-xs font-mono text-red-500 uppercase mb-3 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Cons
                    </h4>
                    <ul className="space-y-1.5">
                      {decisionResult.cons.map((c, i) => (
                        <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                          <span className="text-red-400 shrink-0">−</span> {c}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                <Card className="p-4 bg-white border border-gray-100 shadow-sm rounded-none">
                  <h4 className="text-xs font-mono text-muted-foreground uppercase mb-3 flex items-center gap-1">
                    <BarChart2 className="w-3 h-3" /> Compensation Benchmark
                  </h4>
                  <p className="text-sm text-gray-700">{decisionResult.compensationBenchmark}</p>
                </Card>

                <Card className="p-4 bg-white border border-gray-100 shadow-sm rounded-none">
                  <h4 className="text-xs font-mono text-muted-foreground uppercase mb-3">Onboarding Needs</h4>
                  <ul className="space-y-1.5">
                    {decisionResult.onboardingNeeds.map((n, i) => (
                      <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                        <ChevronRight className="w-3 h-3 text-primary mt-0.5 shrink-0" /> {n}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <span className="text-xs text-muted-foreground font-mono">Retention Risk: </span>
                    <span className="text-xs text-gray-600">{decisionResult.retentionRiskReason}</span>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
