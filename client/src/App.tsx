import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ReactLenis } from "lenis/react";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Home = lazy(() => import("./pages/Home"));
const AcademicStress = lazy(() => import("./pages/AcademicStress"));
const Consultation = lazy(() => import("./pages/Consultation"));
const Meditation = lazy(() => import("./pages/Meditation"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
      <div className="flex items-center gap-3" role="status" aria-live="polite">
        <span className="size-2 animate-pulse rounded-full bg-primary" aria-hidden="true" />
        <span className="text-sm text-muted-foreground">Loading your wellness space…</span>
      </div>
    </main>
  );
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={LandingPage} />
      <Route path={"/app"} component={Home} />
      <Route path={"/app/academic-stress"} component={AcademicStress} />
      <Route path={"/academic-stress"} component={AcademicStress} />
      <Route path={"/app/consultation"} component={Consultation} />
      <Route path={"/consultation"} component={Consultation} />
      <Route path={"/app/meditation"} component={Meditation} />
      <Route path={"/meditation"} component={Meditation} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ReactLenis root>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Suspense fallback={<RouteLoading />}>
              <Router />
            </Suspense>
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </ReactLenis>
  );
}

export default App;
