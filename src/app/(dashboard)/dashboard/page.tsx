"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ScanSearch,
  PenTool,
  BellRing,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DEMO_APPLICATIONS, DEMO_ANALYTICS, DEMO_ATS_RESULT } from "@/lib/demo-data";
import { JobApplication } from "@/types";
import { stringToColor, relativeTime } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);

  // Group stats
  const activeCount = DEMO_APPLICATIONS.filter(
    (a) => a.stage !== "rejected" && a.stage !== "ghosted"
  ).length;

  const interviewCount = DEMO_APPLICATIONS.filter(
    (a) => a.stage === "interviewing" || a.stage === "screening"
  ).length;

  const offerCount = DEMO_APPLICATIONS.filter((a) => a.stage === "offer").length;

  // Upcoming follow ups
  const followUpQueue = DEMO_APPLICATIONS.filter((a) => a.next_follow_up);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-primary/10 via-card to-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Job Hunt Season • Week 4</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, Alex! 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              You have <span className="text-foreground font-semibold">2 upcoming interviews</span> and{" "}
              <span className="text-amber-400 font-semibold">{followUpQueue.length} follow-ups</span> waiting for action.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/scanner">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-md shadow-primary/20">
                <ScanSearch className="w-4 h-4 mr-1.5" />
                Scan Resume
              </Button>
            </Link>
            <Link href="/cover-letter">
              <Button size="sm" variant="outline" className="text-xs font-semibold border-border">
                <PenTool className="w-4 h-4 mr-1.5 text-primary" />
                Draft Letter
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <Card className="bg-card/70 border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active In Pipeline
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">+3 this week</span>
              <span>across 8 companies</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="bg-card/70 border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Response Rate
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{DEMO_ANALYTICS.response_rate}%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">+18% above</span>
              <span>industry avg (22%)</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="bg-card/70 border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Interviews Scheduled
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{interviewCount}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-amber-400 font-semibold">Google & Notion</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="bg-card/70 border-border/80 bg-gradient-to-br from-emerald-500/5 to-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Offers Received
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-400">{offerCount}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">Linear ($185k)</span>
              <span>• Deadline Nov 3</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Status Breakdown Bar */}
      <Card className="bg-card/70 border-border/80">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-foreground">Pipeline Funnel Distribution</span>
            <Link href="/tracker" className="text-primary hover:underline flex items-center gap-1">
              <span>View Full Kanban</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-3 w-full bg-muted/60 rounded-full overflow-hidden flex">
            <div style={{ width: "20%" }} className="bg-slate-400" title="Wishlist: 2" />
            <div style={{ width: "30%" }} className="bg-blue-500" title="Applied: 3" />
            <div style={{ width: "10%" }} className="bg-cyan-500" title="Screening: 1" />
            <div style={{ width: "10%" }} className="bg-amber-500" title="Interviewing: 1" />
            <div style={{ width: "10%" }} className="bg-emerald-500" title="Offer: 1" />
            <div style={{ width: "10%" }} className="bg-rose-500" title="Rejected: 1" />
            <div style={{ width: "10%" }} className="bg-zinc-600" title="Ghosted: 1" />
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400" /> Wishlist (2)</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Applied (3)</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Screening (1)</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Interview (1)</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Offer (1)</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Rejected (1)</div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Follow-Up Center */}
          <Card className="bg-card/70 border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-amber-400" />
                  <span>Action Required: Follow-Up Queue</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Recruiters forget. Sending a polite note boosts response by ~30%.
                </CardDescription>
              </div>
              <Link href="/follow-ups">
                <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {followUpQueue.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border/70 bg-background/50 hover:bg-muted/30 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${stringToColor(
                        app.company
                      )}`}
                    >
                      {app.company[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{app.company}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-blue-500/40 text-blue-400">
                          {app.stage}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{app.position}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <div className="text-left sm:text-right text-xs">
                      <span className="text-amber-400 font-semibold block text-[11px]">Due Today</span>
                      <span className="text-muted-foreground text-[10px]">Applied {relativeTime(app.applied_at || app.created_at)}</span>
                    </div>
                    <Link href="/follow-ups">
                      <Button size="sm" variant="secondary" className="h-8 text-xs font-medium">
                        Draft Email
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Pipeline List */}
          <Card className="bg-card/70 border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">Recent Pipeline Activity</CardTitle>
                <CardDescription className="text-xs">
                  Your most recent job updates and submissions
                </CardDescription>
              </div>
              <Link href="/tracker">
                <Button variant="ghost" size="sm" className="text-xs text-primary">
                  Manage Pipeline
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/60">
                {DEMO_APPLICATIONS.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedJob(app)}
                    className="py-3 flex items-center justify-between hover:bg-muted/30 px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${stringToColor(
                          app.company
                        )}`}
                      >
                        {app.company[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                          {app.company}
                        </p>
                        <p className="text-xs text-muted-foreground">{app.position}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs text-muted-foreground">
                          {app.salary_min ? `$${(app.salary_min / 1000).toFixed(0)}k - $${(app.salary_max! / 1000).toFixed(0)}k` : "Salary unspecified"}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[11px] capitalize font-medium ${
                          app.stage === "offer"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : app.stage === "interviewing"
                            ? "bg-amber-500/20 text-amber-400"
                            : app.stage === "applied"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {app.stage}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col on desktop) */}
        <div className="space-y-6">
          {/* Latest ATS Scan Widget */}
          <Card className="bg-card/70 border-border/80">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ScanSearch className="w-4 h-4 text-primary" />
                  <span>Latest ATS Audit</span>
                </CardTitle>
                <Badge className="bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  {DEMO_ATS_RESULT.match_score}% Score
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Audited against Google Senior Product Manager role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Keywords Matched</span>
                  <span className="font-semibold text-foreground">9 of 15 detected</span>
                </div>
                <Progress value={DEMO_ATS_RESULT.match_score} className="h-2" />
              </div>

              <div>
                <p className="text-xs font-semibold text-red-400 mb-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Missing Crucial Keywords:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DEMO_ATS_RESULT.missing_keywords.slice(0, 4).map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/20"
                    >
                      +{kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link href="/scanner">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Complete Audit & Fixes
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* AI Career Coach Pro-Tip */}
          <div className="p-4 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card space-y-2.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Search Intelligence</span>
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              Tuesday 10 AM is the highest reply window
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Applications submitted between 9:00 AM and 11:00 AM on Tuesdays receive a 38% faster initial screening than applications submitted on weekends.
            </p>
            <div className="pt-1">
              <Link href="/tracker">
                <span className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                  Queue applications for tomorrow →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Job Application Details Dialog */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${stringToColor(
                    selectedJob.company
                  )}`}
                >
                  {selectedJob.company[0]}
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold">{selectedJob.company}</DialogTitle>
                  <p className="text-xs text-muted-foreground">{selectedJob.position}</p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-muted/40">
                <span className="text-muted-foreground">Current Stage:</span>
                <Badge variant="outline" className="capitalize text-xs font-semibold">
                  {selectedJob.stage}
                </Badge>
              </div>

              {selectedJob.salary_min && (
                <div className="flex justify-between p-2 rounded bg-muted/40">
                  <span className="text-muted-foreground">Target Salary:</span>
                  <span className="font-semibold text-emerald-400">
                    ${(selectedJob.salary_min / 1000).toFixed(0)}k - ${(selectedJob.salary_max! / 1000).toFixed(0)}k
                  </span>
                </div>
              )}

              {selectedJob.location && (
                <div className="flex justify-between p-2 rounded bg-muted/40">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="text-foreground">{selectedJob.location}</span>
                </div>
              )}

              {selectedJob.notes && (
                <div className="p-3 rounded-lg border border-border bg-background/50 space-y-1">
                  <span className="font-semibold text-foreground block">Interview Notes:</span>
                  <p className="text-muted-foreground leading-relaxed">{selectedJob.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedJob(null)} className="text-xs">
                Close
              </Button>
              <Link href="/tracker">
                <Button size="sm" className="bg-primary text-primary-foreground text-xs font-semibold">
                  Open in Kanban
                </Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
