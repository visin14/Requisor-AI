import ResumeHistory from "./pages/ResumeHistory";
import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { shadcn } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Candidate from "@/pages/Candidate";
import Recruiter from "@/pages/Recruiter";
import NotFound from "@/pages/not-found";
import CandidateDashboard from "@/pages/CandidateDashboard";
import RecruiterDashboard from "@/pages/RecruiterDashboard";
import ResumeMatching from "./pages/ResumeMatching";
import SemanticMatching from "./pages/SemanticMatching";
import HiringDecision from "./pages/HiringDecision";

const queryClient = new QueryClient();

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const clerkProxyUrl = undefined;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/dino-logo.jpeg`,
  },
  variables: {
    colorPrimary: "#10b981",
    colorForeground: "#111827",
    colorMutedForeground: "#6b7280",
    colorDanger: "#ef4444",
    colorBackground: "#ffffff",
    colorInput: "#f9fafb",
    colorInputForeground: "#111827",
    colorNeutral: "#d1fae5",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    borderRadius: "0px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white w-[440px] max-w-full overflow-hidden shadow-[0_8px_40px_rgba(16,185,129,0.15)] border border-emerald-100",
    card: "!shadow-none !border-0 !bg-transparent",
    footer: "!shadow-none !border-0 !bg-transparent",
    headerTitle: "text-gray-900 font-bold tracking-tight",
    headerSubtitle: "text-gray-500",
    socialButtonsBlockButtonText: "text-gray-700 font-medium",
    formFieldLabel: "text-gray-700 font-medium text-sm",
    footerActionLink: "text-emerald-600 font-semibold",
    footerActionText: "text-gray-500",
    dividerText: "text-gray-400",
    identityPreviewEditButton: "text-emerald-600",
    formFieldSuccessText: "text-emerald-600",
    alertText: "text-gray-700",
    logoBox: "mb-1",
    logoImage: "rounded-xl w-12 h-12 object-cover",
    socialButtonsBlockButton: "border border-gray-200 transition-colors",
    formButtonPrimary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] font-semibold",
    formFieldInput: "border-gray-200 bg-white text-gray-900",
    footerAction: "bg-gray-50 border-t border-gray-100",
    dividerLine: "bg-emerald-100",
    alert: "",
    otpCodeFieldInput: "border-gray-200",
    formFieldRow: "gap-4",
    main: "px-2",
  },
};

function SignInPage() {
  return (
    <div
      className="relative min-h-[100dvh] flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse at 30% 40%,#ecfdf5 0%,#f0fdf4 40%,#ffffff 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[540, 380, 220].map((s, i) => (
          <div
            key={s}
            style={{
              position: "absolute",
              right: "5%",
              top: "10%",
              width: s,
              height: s,
              borderRadius: "50%",
              border: `1px solid rgba(52,211,153,${0.18 - i * 0.05})`,
              transform: "translate(30%,-30%)",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <p className="text-xs font-mono text-emerald-500 uppercase tracking-widest">
            Requisor AI · Resume Intelligence
          </p>
        </div>

        <SignIn
          routing="path"
          path={`${basePath}/sign-in`}
          signUpUrl={`${basePath}/sign-up`}
        />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div
      className="relative min-h-[100dvh] flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse at 70% 60%,#ecfdf5 0%,#f0fdf4 40%,#ffffff 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[400, 280, 160].map((s, i) => (
          <div
            key={s}
            style={{
              position: "absolute",
              left: "5%",
              bottom: "10%",
              width: s,
              height: s,
              borderRadius: "50%",
              border: `1px solid rgba(52,211,153,${0.15 - i * 0.04})`,
              transform: "translate(-30%,30%)",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <p className="text-xs font-mono text-emerald-500 uppercase tracking-widest">
            Requisor AI · Resume Intelligence
          </p>
        </div>

        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          signInUrl={`${basePath}/sign-in`}
        />
      </div>
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsub = addListener(({ user }) => {
      const userId = user?.id ?? null;

      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }

      prevUserIdRef.current = userId;
    });

    return unsub;
  }, [addListener, qc]);

  return null;
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/candidate-dashboard" />
      </Show>

      <Show when="signed-out">
        <Layout>
          <Home />
        </Layout>
      </Show>
    </>
  );
}

function ProtectedPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in">
        <Layout>{children}</Layout>
      </Show>

      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function AppRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to your Requisor account",
          },
        },
        signUp: {
          start: {
            title: "Get started free",
            subtitle: "Create your Requisor account today",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClerkQueryClientCacheInvalidator />

          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />

            <Route path="/candidate">
  <ProtectedPage>
    <Candidate />
  </ProtectedPage>
</Route>

<Route path="/recruiter">
  <ProtectedPage>
    <Recruiter />
  </ProtectedPage>
</Route>

{/* NEW ROUTES START HERE */}

<Route path="/candidate-dashboard">
  <ProtectedPage>
    <CandidateDashboard />
  </ProtectedPage>
</Route>

<Route path="/recruiter-dashboard">
  <ProtectedPage>
    <RecruiterDashboard />
  </ProtectedPage>
</Route>

<Route path="/recruiter/match">
  <ProtectedPage>
    <ResumeMatching />
  </ProtectedPage>
</Route>

<Route path="/recruiter/semantic-match">
  <ProtectedPage>
    <SemanticMatching />
  </ProtectedPage>
</Route>

<Route path="/recruiter/decision">
  <ProtectedPage>
    <HiringDecision />
  </ProtectedPage>
</Route>

<Route path="/resume-history">
  <ProtectedPage>
    <ResumeHistory />
  </ProtectedPage>
</Route>
{/* NEW ROUTES END HERE */}

<Route>
  <Layout>
    <NotFound />
  </Layout>
</Route>
</Switch>

          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <AppRoutes />
    </WouterRouter>
  );
}

export default App;