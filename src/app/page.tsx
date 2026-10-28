"use client";

import Link from "next/link";
import {
  ScanSearch,
  Kanban,
  PenTool,
  BellRing,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  Send,
  FileText,
  Target,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/25">
              🎯
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                LaunchPad
              </span>
              <span className="text-[10px] uppercase font-semibold text-primary ml-1.5 px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                AI Pro
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pain-points" className="hover:text-foreground transition-colors">
              The Problem
            </a>
            <a href="#workflow" className="hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Sign in
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 font-medium">
                Try Free Demo
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for the 2026 AI-driven Job Market</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Your AI Job Search{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-primary bg-clip-text text-transparent">
              Command Center
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop losing opportunities to ATS black holes and messy spreadsheets.
            Audit your resume with AI, organize pipeline stages, generate tailored letters,
            and never miss a critical follow-up.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/25 font-semibold">
                Launch Workspace (Demo)
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/scanner">
              <Button size="lg" variant="outline" className="h-12 px-6 text-base border-border bg-card/50 hover:bg-card">
                <ScanSearch className="w-4 h-4 mr-2 text-primary" />
                Scan My Resume
              </Button>
            </Link>
          </div>

          {/* Social proof / stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free tier forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ready-to-use demo data preloaded</span>
            </div>
          </div>

          {/* Mockup Dashboard Preview */}
          <div className="mt-14 relative mx-auto max-w-5xl rounded-2xl border border-border/80 bg-card/60 p-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 px-3 border-b border-border/50 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-[11px] text-muted-foreground/80">launchpad.app/tracker</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/30 text-primary">Live Workspace</Badge>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              {/* Column 1 */}
              <div className="bg-background/60 rounded-xl p-3 border border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <span>📌</span> Wishlist
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">2</Badge>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-card border border-border/80 text-xs shadow-sm">
                    <p className="font-semibold text-foreground">Figma</p>
                    <p className="text-muted-foreground text-[11px]">UX Researcher</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="text-emerald-400 font-mono">$140k - $190k</span>
                      <span>Added 2d ago</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-card border border-border/80 text-xs shadow-sm">
                    <p className="font-semibold text-foreground">Airbnb</p>
                    <p className="text-muted-foreground text-[11px]">Staff Search Eng</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="text-emerald-400 font-mono">$200k+</span>
                      <span>Target role</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="bg-background/60 rounded-xl p-3 border border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <span>📨</span> Applied
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">3</Badge>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-card border border-blue-500/40 text-xs shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500" />
                    <p className="font-semibold text-foreground">Stripe</p>
                    <p className="text-muted-foreground text-[11px]">Software Engineer, Payments</p>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-blue-400 font-medium">Follow-up: Today</span>
                      <span className="text-muted-foreground">Applied 7d ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="bg-background/60 rounded-xl p-3 border border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <span>📞</span> Interviewing
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">1</Badge>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-card border border-yellow-500/40 text-xs shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-yellow-500" />
                    <p className="font-semibold text-foreground">Google</p>
                    <p className="text-muted-foreground text-[11px]">Senior Product Manager</p>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-amber-400 font-medium">Tech Round Next</span>
                      <span className="text-muted-foreground font-mono">94% ATS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 4 */}
              <div className="bg-background/60 rounded-xl p-3 border border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <span>🎉</span> Offers
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-500/20 text-emerald-400">1</Badge>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-card border border-emerald-500/40 text-xs shadow-sm relative overflow-hidden bg-emerald-500/5">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-500" />
                    <p className="font-semibold text-foreground">Linear</p>
                    <p className="text-muted-foreground text-[11px]">Full Stack Engineer</p>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-bold">$185,000 + Equity</span>
                      <span className="text-muted-foreground">Expires Nov 3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section id="pain-points" className="py-20 border-t border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-red-400 tracking-wider mb-2">
              The Brutal Reality
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Why applying online feels like shouting into an abyss
            </h3>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">
              The modern hiring funnel is automated by bots. Candidates using outdated tools get buried in the screening filter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/70 border-border/80 hover:border-red-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-lg mb-4">
                  75%
                </div>
                <h4 className="font-semibold text-base mb-2">ATS Rejection Rate</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Three out of four resumes are rejected by applicant tracking software before a human recruiter ever sees them.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/70 border-border/80 hover:border-amber-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                  150+
                </div>
                <h4 className="font-semibold text-base mb-2">Applications Lost</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Spreadsheets quickly become chaotic. Candidates forget where they applied, who the contact was, and which resume was sent.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/70 border-border/80 hover:border-yellow-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center font-bold text-lg mb-4">
                  45m
                </div>
                <h4 className="font-semibold text-base mb-2">Wasted on Each Letter</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Writing tailored cover letters from scratch drains hours every single day, leading to burnout and sloppy copy-paste errors.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/70 border-border/80 hover:border-primary/40 transition-colors">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mb-4">
                  85%
                </div>
                <h4 className="font-semibold text-base mb-2">Complete Ghosting</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Candidates never follow up because there is no reminder system. Yet timely follow-ups increase interview conversion by over 30%.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-24 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/10">
              Complete Feature Suite
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need to turn applications into offers
            </h2>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">
              LaunchPad replaces 5 separate tools with an integrated command center.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card/60 border border-border/80 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
                  <ScanSearch className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">AI ATS Scanner</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Upload your resume and paste any job listing. Our LLM parses keyword density, formatting bugs, missing skills, and predicts your exact match percentage.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-blue-400">
                <span>94% match target score</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-card/60 border border-border/80 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                  <Kanban className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Kanban Pipeline Tracker</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A high-velocity visual board built specifically for job hunts. Track status from wishlist to offer with salary filters, company notes, and recruiter contacts.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-emerald-400">
                <span>No more spreadsheet clutter</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-card/60 border border-border/80 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5">
                  <PenTool className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Smart Cover Letter Studio</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Generate tailored, human-sounding cover letters in seconds based on your real experience and the specific requirements of the role.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-purple-400">
                <span>Custom tones & PDF export</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-card/60 border border-border/80 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5">
                  <BellRing className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Follow-Up Reminders</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Never let an application slip into silence. Get calculated reminders when 7, 14, or 21 days pass, complete with pre-drafted polite emails to send.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-amber-400">
                <span>+30% response rate</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-card/60 border border-border/80 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-5">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Funnel Analytics</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  See where your candidates drop off. Understand which resume versions convert best, how long responses take, and what industries provide the highest yield.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-rose-400">
                <span>Data-driven job hunting</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-card/60 border border-border/80 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between bg-gradient-to-br from-primary/10 to-card">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-5">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Instant 1-Click Capture</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Clip openings from LinkedIn, Indeed, Greenhouse, or Lever directly to your pipeline in 1 click with parsed role titles and compensation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-primary">
                <span>Fastest workflow in the game</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 border-t border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-primary tracking-wider mb-2">
              Simple 3-Step Process
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
              From application to offer letter in record time
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-card/70 border border-border p-6 rounded-2xl">
              <div className="text-3xl font-black text-primary/40 mb-3">01</div>
              <h4 className="text-lg font-semibold mb-2">Save & Inspect</h4>
              <p className="text-sm text-muted-foreground">
                Paste the job listing and run the AI ATS scan to discover critical keyword gaps before you hit send.
              </p>
            </div>
            <div className="bg-card/70 border border-border p-6 rounded-2xl">
              <div className="text-3xl font-black text-primary/40 mb-3">02</div>
              <h4 className="text-lg font-semibold mb-2">Tailor & Apply</h4>
              <p className="text-sm text-muted-foreground">
                Generate a custom cover letter and tailored summary bullet points matched to the job description requirements.
              </p>
            </div>
            <div className="bg-card/70 border border-border p-6 rounded-2xl">
              <div className="text-3xl font-black text-primary/40 mb-3">03</div>
              <h4 className="text-lg font-semibold mb-2">Track & Follow Up</h4>
              <p className="text-sm text-muted-foreground">
                Move cards across your Kanban stages, receive automated follow-up reminders, and ace interview loops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/10">
              Fair & Transparent
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Invest in your career, not overpriced subscriptions
            </h2>
            <p className="mt-4 text-muted-foreground text-sm">
              Competitors charge $40-$50/month. We give you all the power for half the price.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Starter</h3>
                <p className="text-xs text-muted-foreground mb-4">Essential tools for casual seekers</p>
                <div className="text-3xl font-bold mb-6">0 ₽ <span className="text-xs font-normal text-muted-foreground">/ бесплатно</span></div>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 15 tracked applications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5 AI ATS resume scans / mo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3 AI cover letters / mo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Kanban pipeline board
                  </li>
                </ul>
              </div>
              <Link href="/dashboard" className="mt-8">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="bg-card border-2 border-primary rounded-2xl p-6 flex flex-col justify-between relative shadow-xl shadow-primary/10 bg-primary/[0.02]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Job Hunter Pro</h3>
                <p className="text-xs text-muted-foreground mb-4">Full firepower to land interviews fast</p>
                <div className="text-3xl font-bold mb-6">1 490 ₽ <span className="text-xs font-normal text-muted-foreground">/ месяц</span></div>
                <ul className="space-y-3 text-xs text-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited tracked applications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited AI ATS resume scans
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited AI cover letters & emails
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Automated smart follow-up reminders
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Full conversion funnel analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Export to PDF & Word
                  </li>
                </ul>
              </div>
              <Link href="/dashboard" className="mt-8">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20">
                  Start 7-Day Trial
                </Button>
              </Link>
            </div>

            {/* Coach Tier */}
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Career Coach</h3>
                <p className="text-xs text-muted-foreground mb-4">For advisors managing multiple clients</p>
                <div className="text-3xl font-bold mb-6">4 990 ₽ <span className="text-xs font-normal text-muted-foreground">/ месяц</span></div>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Everything in Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Manage up to 25 job seekers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Client progress overview
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> White-label audit reports
                  </li>
                </ul>
              </div>
              <Link href="/dashboard" className="mt-8">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-border/60 bg-gradient-to-b from-card to-background text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Stop waiting. Start landing interviews.
          </h2>
          <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
            Experience the entire workflow right now with our interactive workspace pre-filled with demo applications.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-9 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/25 font-bold">
                Open Command Center
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10 bg-background text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <span>🎯</span>
            <span>LaunchPad © 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/tracker" className="hover:text-foreground transition-colors">Tracker</Link>
            <Link href="/scanner" className="hover:text-foreground transition-colors">ATS Scanner</Link>
            <Link href="/cover-letter" className="hover:text-foreground transition-colors">Cover Letter AI</Link>
            <Link href="/follow-ups" className="hover:text-foreground transition-colors">Follow-ups</Link>
            <Link href="/analytics" className="hover:text-foreground transition-colors">Analytics</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
