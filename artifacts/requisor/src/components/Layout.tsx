import { ReactNode } from "react";
import { Link } from "wouter";
import ThreeBackground from "./ThreeBackground";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* 3D Background - Fixed behind everything */}
      <div className="fixed inset-0 z-0">
        <ThreeBackground />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/40 transition-colors">
              <BrainCircuit className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Requisor</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/candidate" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Candidate
            </Link>
            <Link href="/recruiter" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Recruiter
            </Link>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(100,50,255,0.3)]">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-16">
        {children}
      </main>
    </div>
  );
}
