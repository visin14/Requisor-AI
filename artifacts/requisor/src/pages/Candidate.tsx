import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileText, CheckCircle2, Target, Code, BookOpen } from "lucide-react";

export default function Candidate() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="container mx-auto px-6 py-12 pb-32">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Candidate Portal</h1>
        <p className="text-muted-foreground font-mono">Upload resume for multidimensional analysis</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Upload & Score */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-8 bg-white border border-dashed border-primary/30 shadow-sm">
            {!uploaded ? (
              <div
                className="flex flex-col items-center justify-center text-center cursor-pointer group"
                onClick={() => setUploaded(true)}
              >
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Drop Resume Here</h3>
                <p className="text-sm text-muted-foreground">PDF, DOCX up to 5MB</p>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium">alex_resume_2024.pdf</h3>
                  <p className="text-sm text-primary flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Parsed successfully
                  </p>
                </div>
              </div>
            )}
          </Card>

          {uploaded && (
            <Card className="p-8 bg-white border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/8 blur-[50px]" />
              <h3 className="text-gray-900 font-medium mb-6">Requisor AI Score</h3>

              <div className="flex justify-center mb-8">
                <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-4 border-primary/15 border-t-primary">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 font-mono">84</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">/ 100</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Technical Fit</span>
                    <span className="text-primary font-mono font-semibold">92%</span>
                  </div>
                  <Progress value={92} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Experience Depth</span>
                    <span className="text-primary font-mono font-semibold">78%</span>
                  </div>
                  <Progress value={78} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Impact Metrics</span>
                    <span className="text-primary font-mono font-semibold">65%</span>
                  </div>
                  <Progress value={65} className="h-1" />
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Roadmap */}
        {uploaded && (
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 bg-white border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" /> Skill Gap Analysis
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                  <h4 className="text-red-500 font-medium mb-2 text-sm">Critical Gap</h4>
                  <p className="text-gray-900 text-lg mb-1">System Architecture</p>
                  <p className="text-gray-500 text-sm">Missing evidence of scaling systems beyond 10k users.</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                  <h4 className="text-amber-500 font-medium mb-2 text-sm">Moderate Gap</h4>
                  <p className="text-gray-900 text-lg mb-1">Cloud Deployment (AWS)</p>
                  <p className="text-gray-500 text-sm">Experience is localized to GCP; role requires multi-cloud.</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Improvement Roadmap</h2>

              <div className="relative border-l border-primary/20 ml-4 space-y-8 pb-4">
                <div className="relative pl-8">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1.5 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                  <div className="flex items-center gap-2 text-sm text-primary mb-1 font-mono">
                    <Code className="w-4 h-4" /> Action Item 1
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Quantify System Impact</h3>
                  <p className="text-gray-500 text-sm">Rewrite your Senior Engineer bullet points to include specific TPS and latency reduction metrics.</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-[6.5px] top-1.5" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 font-mono">
                    <BookOpen className="w-4 h-4" /> Action Item 2
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">AWS Certification Path</h3>
                  <p className="text-gray-500 text-sm">Consider completing AWS Solutions Architect Associate to bridge the cloud provider gap.</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
