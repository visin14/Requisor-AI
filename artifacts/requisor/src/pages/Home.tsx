import { useEffect, useRef } from "react";
import { Link } from "wouter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { FileText, Cpu, Target, LineChart, Users, ShieldAlert, ArrowRight, Activity, Zap, BarChart3, Map, CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text split animation
      if (heroTextRef.current) {
        const text = heroTextRef.current.innerText;
        heroTextRef.current.innerHTML = "";
        
        const chars = text.split("").map(char => {
          const span = document.createElement("span");
          span.innerText = char === " " ? "\u00A0" : char;
          span.className = "inline-block opacity-0 translate-y-10";
          heroTextRef.current?.appendChild(span);
          return span;
        });

        gsap.to(chars, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.02,
          ease: "power4.out",
          delay: 0.2
        });
      }

      // Feature cards stagger in
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(card,
          { 
            y: 50, 
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            }
          }
        );
      });

      // Section headings
      gsap.utils.toArray(".section-heading").forEach((heading: any) => {
        gsap.fromTo(heading,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: heading,
              start: "top 80%",
            }
          }
        );
      });

      // Stat counters
      gsap.utils.toArray(".stat-counter").forEach((counter: any) => {
        const targetValue = parseFloat(counter.getAttribute("data-value"));
        const prefix = counter.getAttribute("data-prefix") || "";
        const suffix = counter.getAttribute("data-suffix") || "";
        
        gsap.fromTo(counter,
          { innerText: 0 },
          {
            innerText: targetValue,
            duration: 2,
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: counter,
              start: "top 85%",
            },
            onUpdate: function() {
              counter.innerText = `${prefix}${Math.round(Number(this.targets()[0].innerText))}${suffix}`;
            }
          }
        );
      });
      
      // Score Ring Animation
      gsap.to(".score-ring-circle", {
        strokeDasharray: "283 283",
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".score-section",
          start: "top 70%"
        }
      });
      
      // Journey Flow
      const journeySteps = gsap.utils.toArray(".journey-step");
      gsap.fromTo(journeySteps, 
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          stagger: 0.3, 
          duration: 0.8,
          scrollTrigger: {
            trigger: ".journey-section",
            start: "top 60%"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: FileText, title: "Resume Parsing", desc: "Extracts context, not just keywords. Understands the narrative of a career." },
    { icon: Target, title: "Semantic Matching", desc: "Aligns candidate intent and potential with complex job requirements." },
    { icon: Cpu, title: "AI Score", desc: "100-point multi-dimensional evaluation eliminating human bias." },
    { icon: LineChart, title: "Improvement Engine", desc: "Generates custom roadmaps to turn rejections into future placements." },
    { icon: Users, title: "Recruiter Dashboard", desc: "Pipeline command center with AI copilot to chat with your talent pool." },
    { icon: ShieldAlert, title: "Fraud Detection", desc: "Instantly spots AI-generated or exaggerated resumes." },
  ];

  return (
    <div ref={containerRef} className="w-full">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center pt-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-primary font-medium tracking-wide">Requisor Engine v2.0 Online</span>
        </div>
        
        <h1 ref={heroTextRef} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6" style={{ perspective: "1000px" }}>
          AI-Powered Hiring Intelligence
        </h1>
        
        <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          Where most ATS systems coldly reject, Requisor illuminates. Precision intelligence meets human compassion.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/candidate">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 h-14 text-lg rounded-none shadow-[0_0_30px_rgba(52,211,153,0.4)]">
              Explore Candidate Portal
            </Button>
          </Link>
          <Link href="/recruiter">
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 h-14 text-lg rounded-none backdrop-blur-md">
              View Recruiter Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* How it Works Pipeline */}
      <section className="py-32 px-6 relative z-10 bg-black/40 backdrop-blur-xl border-y border-white/5">
        <div className="container mx-auto">
          <h2 className="section-heading text-3xl md:text-5xl font-bold text-center mb-24 text-white">
            The Intelligence Pipeline
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-white/10 z-0" />
            
            {["Upload", "Parse", "Score", "Decide"].map((step, i) => (
              <div key={step} className="flex flex-col items-center relative w-full md:w-1/4 z-10">
                <div className="w-20 h-20 bg-background border-2 border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(100,50,255,0.2)]">
                  <span className="text-2xl font-mono font-bold text-primary">0{i+1}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step}</h3>
                <p className="text-white/50 text-sm text-center max-w-[200px]">
                  {i === 0 && "Securely ingest data"}
                  {i === 1 && "Extract semantic meaning"}
                  {i === 2 && "Multi-dimensional analysis"}
                  {i === 3 && "Actionable outcomes"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mb-20">
            <h2 className="section-heading text-3xl md:text-5xl font-bold text-white mb-6">
              Precision Tooling
            </h2>
            <p className="text-xl text-white/60">A modular architecture designed for the future of talent acquisition.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div 
                key={i} 
                ref={el => cardsRef.current[i] = el}
                className="group p-8 bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-primary/50 transition-all duration-500 backdrop-blur-md"
              >
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Score Breakdown */}
      <section className="score-section py-32 px-6 relative z-10 bg-primary/5 border-y border-white/5 backdrop-blur-xl">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-heading text-3xl md:text-5xl font-bold text-white mb-6">
                The 100-Point Architecture
              </h2>
              <p className="text-lg text-white/60 mb-8">
                We replace gut feelings with deterministic analysis. The Requisor Score breaks down a candidate's profile into granular, objective metrics.
              </p>
              
              <div className="space-y-6">
                {[
                  { label: "Technical Competence", val: "30%" },
                  { label: "Project Impact", val: "20%" },
                  { label: "Domain Relevance", val: "25%" },
                  { label: "Growth Trajectory", val: "15%" },
                  { label: "Communication Clarity", val: "10%" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-white font-medium flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {item.label}
                    </span>
                    <span className="font-mono text-primary">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative w-80 h-80 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <circle 
                    className="score-ring-circle"
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="4" 
                    strokeDasharray="0 283"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-6xl font-bold font-mono text-white tracking-tighter">84</div>
                  <div className="text-sm font-mono text-primary uppercase tracking-widest mt-2">Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate Journey */}
      <section className="journey-section py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="section-heading text-3xl md:text-5xl font-bold text-white mb-6">
              Rejection is Redirection
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              We transform the cold "No" into a structured path forward.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="journey-step bg-white/5 border border-red-500/20 p-8 relative">
              <div className="text-red-400 font-mono text-sm mb-4">Status: Rejected</div>
              <h3 className="text-2xl font-bold text-white mb-4">The Current Standard</h3>
              <p className="text-white/60">A generic email. No feedback. No context. The candidate leaves frustrated and confused.</p>
            </div>
            
            <div className="journey-step bg-white/5 border border-primary/30 p-8 relative mt-8 md:mt-0">
              <div className="text-primary font-mono text-sm mb-4 flex items-center gap-2"><Map className="w-4 h-4" /> The Requisor Roadmap</div>
              <h3 className="text-2xl font-bold text-white mb-4">Actionable Gaps</h3>
              <p className="text-white/60">AI pinpoints exact missing skills (e.g. "Needs React Native context") and suggests learning paths.</p>
            </div>
            
            <div className="journey-step bg-white/5 border border-green-500/30 p-8 relative mt-16 md:mt-0">
              <div className="text-green-400 font-mono text-sm mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 3 Months Later</div>
              <h3 className="text-2xl font-bold text-white mb-4">Re-evaluation</h3>
              <p className="text-white/60">Candidate re-applies with upgraded skills. System recognizes growth trajectory and boosts score.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 relative z-10 border-y border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2 stat-counter font-mono" data-value="90" data-suffix="%">0%</div>
              <div className="text-white/50 font-mono text-sm tracking-widest uppercase">Screening Time Saved</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-accent mb-2 stat-counter font-mono" data-value="15">0</div>
              <div className="text-white/50 font-mono text-sm tracking-widest uppercase">Analysis Modules</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2 stat-counter font-mono" data-value="100">0</div>
              <div className="text-white/50 font-mono text-sm tracking-widest uppercase">Point Scoring System</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 stat-counter font-mono" data-value="3" data-suffix="w">0</div>
              <div className="text-white/50 font-mono text-sm tracking-widest uppercase">Avg. Improvement</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 text-center flex flex-col items-center">
        <Zap className="w-12 h-12 text-primary mb-8 animate-pulse" />
        <h2 className="section-heading text-4xl md:text-6xl font-bold text-white mb-8 max-w-3xl mx-auto">
          Take command of your hiring pipeline.
        </h2>
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-12 h-16 text-xl rounded-none shadow-[0_0_40px_rgba(52,211,153,0.5)] group mt-8">
          Initialize System <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      </section>
    </div>
  );
}
