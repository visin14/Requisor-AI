import { ReactNode } from "react";
import { Link } from "wouter";
import ThreeBackground from "./ThreeBackground";
import { Button } from "@/components/ui/button";
import dinoLogo from "@assets/dino_1782732856077.jpeg";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated Background - Fixed behind everything */}
      <div className="fixed inset-0 z-0">
        <ThreeBackground />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="rounded-xl overflow-hidden w-9 h-9 ring-2 ring-primary/30 group-hover:ring-primary/70 transition-all shadow-[0_0_14px_rgba(16,185,129,0.2)]">
              <img src={dinoLogo} alt="Requisor Dino Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">Requisor</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/candidate" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Candidate
            </Link>
            <Link href="/recruiter" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Recruiter
            </Link>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]">
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
