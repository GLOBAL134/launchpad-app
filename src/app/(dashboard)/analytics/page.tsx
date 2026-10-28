"use client";

import {
  BarChart3,
  TrendingUp,
  PieChart,
  Target,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DEMO_ANALYTICS, DEMO_APPLICATIONS } from "@/lib/demo-data";

export default function AnalyticsPage() {
  const funnelStages = [
    { label: "Submitted Applications", count: 10, pct: 100, color: "bg-blue-500" },
    { label: "Recruiter Screen Passed", count: 4, pct: 40, color: "bg-cyan-500" },
    { label: "Technical / PM Interviews", count: 2, pct: 20, color: "bg-amber-500" },
    { label: "Job Offers Received", count: 1, pct: 10, color: "bg-emerald-500" },
  ];

  const channels = [
    { name: "Direct Referral", count: 3, replyRate: 67, color: "text-emerald-400" },
    { name: "LinkedIn Jobs", count: 4, replyRate: 25, color: "text-blue-400" },
    { name: "Company Careers Portal", count: 3, replyRate: 33, color: "text-amber-400" },
  ];

  const weeklyActivity = [
    { week: "Week 1", count: 2, target: 4 },
    { week: "Week 2", count: 3, target: 4 },
    { week: "Week 3", count: 2, target: 4 },
    { week: "Week 4 (Current)", count: 3, target: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <span>Performance & Funnel Analytics</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your application velocity, stage conversion bottlenecks, and channel effectiveness.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/70 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-semibold text-muted-foreground">
              Total Tracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">
              {DEMO_ANALYTICS.total_applications}
            </div>
            <p className="text-xs text-muted-foreground mt-1">10 total applications</p>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-semibold text-muted-foreground">
              Interview Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-400">
              {DEMO_ANALYTICS.interview_rate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Industry average: 12%</p>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-semibold text-muted-foreground">
              Offer Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-400">
              {DEMO_ANALYTICS.offer_rate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">1 official offer (Linear)</p>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-semibold text-muted-foreground">
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-400">
              {DEMO_ANALYTICS.avg_days_to_response}d
            </div>
            <p className="text-xs text-muted-foreground mt-1">From submit to first screen</p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel & Conversion Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Funnel (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-card/70 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span>Candidate Conversion Funnel</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Visual drop-off rates at each hiring stage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {funnelStages.map((stage, idx) => (
                <div key={stage.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono">0{idx + 1}.</span>
                      <span className="text-foreground">{stage.label}</span>
                    </span>
                    <span className="text-muted-foreground">
                      <span className="font-bold text-foreground">{stage.count}</span> ({stage.pct}%)
                    </span>
                  </div>

                  <div className="h-6 w-full bg-background rounded-lg overflow-hidden border border-border/60 p-0.5">
                    <div
                      className={`h-full rounded-md ${stage.color} transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-bold text-white shadow-sm`}
                      style={{ width: `${stage.pct}%` }}
                    >
                      {stage.pct >= 15 && `${stage.count} roles`}
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-4 p-3 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <span>
                  <strong>Insight:</strong> Your funnel drops most between screening and technical rounds (50% drop-off). Practice mock system design to improve pass rate.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Submission Velocity */}
          <Card className="bg-card/70 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Weekly Application Velocity</CardTitle>
              <CardDescription className="text-xs">
                Target: 4 high-quality tailored submissions per week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3 pt-2">
                {weeklyActivity.map((w) => (
                  <div
                    key={w.week}
                    className="p-3 rounded-xl bg-background border border-border/70 text-center space-y-2"
                  >
                    <span className="text-[11px] font-medium text-muted-foreground block truncate">
                      {w.week}
                    </span>
                    <div className="text-2xl font-black text-foreground">{w.count}</div>
                    <Progress value={(w.count / w.target) * 100} className="h-1.5" />
                    <span className="text-[10px] text-muted-foreground block">
                      {Math.round((w.count / w.target) * 100)}% target
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Channel Yield & Strategy (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Channel Conversion */}
          <Card className="bg-card/70 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Source Channel Yield</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Which channels generate the highest interview conversion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {channels.map((ch) => (
                <div
                  key={ch.name}
                  className="p-3 rounded-xl border border-border/70 bg-background/50 flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-xs text-foreground block">{ch.name}</span>
                    <span className="text-[11px] text-muted-foreground">{ch.count} submissions</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold text-sm ${ch.color}`}>{ch.replyRate}%</span>
                    <span className="text-[10px] text-muted-foreground block">Reply Rate</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Strategy Playbook */}
          <Card className="bg-card/70 border-border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Sparkles className="w-4 h-4" />
                <span>AI Strategy Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Prioritize Referrals:</strong> Your referral applications have a 67% reply rate vs 25% on LinkedIn. Spend 60% of your time networking.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>ATS Optimization Impact:</strong> Resumes with score &gt;85% yield a 3.2x higher interview invite rate across all portals.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Salary Benchmark:</strong> Your pipeline average is $175,000. Your current offer from Linear is at $185,000 (top quartile).
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
