import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileText, CheckCircle2, ChevronRight, Target, Code, BookOpen } from "lucide-react";

export default function Candidate() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="container mx-auto px-6 py-12 pb-32">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Candidate Portal</h1>
        <p className="text-white/60 font-mono">Upload resume for multidimensional analysis</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Upload & Score */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-8 bg-white/[0.02] border-white/10 backdrop-blur-xl border-dashed">
            {!uploaded ? (
              <div 
                className="flex flex-col items-center justify-center text-center cursor-pointer group"
                onClick={() => setUploaded(true)}
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Drop Resume Here</h3>
                <p className="text-sm text-white/50">PDF, DOCX up to 5MB</p>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">alex_resume_2024.pdf</h3>
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Parsed successfully
                  </p>
                </div>
              </div>
            )}
          </Card>

          {uploaded && (
            <Card className="p-8 bg-white/[0.02] border-white/10 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px]" />
              <h3 className="text-white font-medium mb-6">Requisor AI Score</h3>
              
              <div className="flex justify-center mb-8">
                <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-4 border-primary/20 border-t-primary">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white font-mono">84</div>
                    <div className="text-xs text-white/50 uppercase tracking-widest">/ 100</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">Technical Fit</span>
                    <span className="text-primary font-mono">92%</span>
                  </div>
                  <Progress value={92} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">Experience Depth</span>
                    <span className="text-primary font-mono">78%</span>
                  </div>
                  <Progress value={78} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">Impact Metrics</span>
                    <span className="text-primary font-mono">65%</span>
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
            <Card className="p-8 bg-white/[0.02] border-white/10 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" /> Skill Gap Analysis
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <h4 className="text-red-400 font-medium mb-2 text-sm">Critical Gap</h4>
                  <p className="text-white text-lg mb-1">System Architecture</p>
                  <p className="text-white/60 text-sm">Missing evidence of scaling systems beyond 10k users.</p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <h4 className="text-yellow-400 font-medium mb-2 text-sm">Moderate Gap</h4>
                  <p className="text-white text-lg mb-1">Cloud Deployment (AWS)</p>
                  <p className="text-white/60 text-sm">Experience is localized to GCP; role requires multi-cloud.</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white/[0.02] border-white/10 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-6">Improvement Roadmap</h2>
              
              <div className="relative border-l border-white/10 ml-4 space-y-8 pb-4">
                <div className="relative pl-8">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1.5 shadow-[0_0_10px_#8b5cf6]" />
                  <div className="flex items-center gap-2 text-sm text-primary mb-1 font-mono">
                    <Code className="w-4 h-4" /> Action Item 1
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Quantify System Impact</h3>
                  <p className="text-white/60 text-sm">Rewrite your Senior Engineer bullet points to include specific TPS and latency reduction metrics.</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-3 h-3 bg-white/20 rounded-full -left-[6.5px] top-1.5" />
                  <div className="flex items-center gap-2 text-sm text-white/50 mb-1 font-mono">
                    <BookOpen className="w-4 h-4" /> Action Item 2
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">AWS Certification Path</h3>
                  <p className="text-white/60 text-sm">Consider completing AWS Solutions Architect Associate to bridge the cloud provider gap.</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
