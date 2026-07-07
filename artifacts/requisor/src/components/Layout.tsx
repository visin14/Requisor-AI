import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Show, useClerk, useUser } from "@clerk/react";

import { Button } from "@/components/ui/button";
import dinoLogo from "@assets/dino_1782732856077.jpeg";

function UserAvatar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-emerald-50 border border-emerald-200">
        {user?.imageUrl ? (
          <img src={user.imageUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
          {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? ""}
        </span>
      </div>
      <button
        onClick={() => signOut({ redirectUrl: basePath || "/" })}
        className="text-xs font-mono text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wide"
      >
        Sign out
      </button>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="rounded-xl overflow-hidden w-9 h-9 ring-2 ring-primary/30 group-hover:ring-primary/70 transition-all shadow-[0_0_14px_rgba(16,185,129,0.2)]">
              <img src={dinoLogo} alt="Requisor Dino Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
  Requisor<span className="text-primary">.AI</span>
</span>
          </Link>

          <div className="flex items-center gap-6">
           <Show when="signed-in">
  <Link href="/candidate-dashboard" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
    Candidate
  </Link>
  <Link href="/recruiter-dashboard" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
    Recruiter
  </Link>
  <UserAvatar />
</Show>

            <Show when="signed-out">
              <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                Candidate
              </Link>
              <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                Recruiter
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 rounded-none text-sm h-9 px-4">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] rounded-none text-sm h-9 px-4">
                  Get Started
                </Button>
              </Link>
            </Show>
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
