import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AcademicStress from "./pages/AcademicStress";
import Consultation from "./pages/Consultation";
import Meditation from "./pages/Meditation";
import LandingPage from "./pages/LandingPage";
import Analytics from "./pages/Analytics";
import Wellness from "./pages/Wellness";
import Journal from "./pages/Journal";
import { ReactLenis } from "lenis/react";

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
      <Route path={"/app/analytics"} component={Analytics} />
      <Route path={"/app/wellness"} component={Wellness} />
      <Route path={"/app/journal"} component={Journal} />
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
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </ReactLenis>
  );
}

export default App;
