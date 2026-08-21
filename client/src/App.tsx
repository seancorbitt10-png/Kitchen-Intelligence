import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
const Home = lazy(() => import("./pages/Home"));

function Router() { return <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f5ef] text-[#1f4a3b]"><div className="surface rounded-3xl px-8 py-6 text-center"><div className="mx-auto size-8 animate-pulse rounded-full bg-[#edb84b]" /><p className="mt-4 font-display text-xl font-bold">Setting the table…</p></div></div>}><Switch><Route path="/" component={Home} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch></Suspense>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
