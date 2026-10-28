"use client";

import { useState } from "react";
import {
  BellRing,
  Clock,
  Send,
  Copy,
  Check,
  AlertCircle,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Mail,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DEMO_APPLICATIONS } from "@/lib/demo-data";
import { JobApplication } from "@/types";
import { stringToColor, relativeTime } from "@/lib/utils";

interface FollowUpItem {
  app: JobApplication;
  urgency: "overdue" | "today" | "upcoming";
  daysElapsed: number;
  subject: string;
  template: string;
}

export default function FollowUpsPage() {
  const [selectedItem, setSelectedItem] = useState<FollowUpItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});

  // Generate follow up items from demo applications
  const followUpItems: FollowUpItem[] = [
    {
      app: DEMO_APPLICATIONS[1], // Stripe
      urgency: "today",
      daysElapsed: 7,
      subject: "Checking In: Software Engineer, Payments Application — Alex Morgan",
      template: `Hi ${DEMO_APPLICATIONS[1].contact_name || "Stripe Recruiting Team"},

I hope your week is off to a great start.

I submitted my application for the Software Engineer, Payments role 7 days ago and wanted to reiterate my enthusiasm for Stripe's infrastructure work. With my background in payment gateway integrations and low-latency APIs, I am confident I can contribute from day one.

Please let me know if there are any additional portfolio samples or details I can provide to support my application.

Best regards,
Alex Morgan
(555) 234-5678`,
    },
    {
      app: DEMO_APPLICATIONS[9], // Netflix
      urgency: "upcoming",
      daysElapsed: 3,
      subject: "Following Up: Senior SWE, UI Platform — Alex Morgan",
      template: `Hello Netflix Talent Acquisition,

I recently applied for the Senior SWE, UI Platform role. I've been closely following Netflix's open-source UI tooling and wanted to share a quick note of appreciation for your team's architecture.

Looking forward to hearing about next steps when the team begins review.

Warm regards,
Alex Morgan`,
    },
    {
      app: DEMO_APPLICATIONS[5], // Meta
      urgency: "overdue",
      daysElapsed: 12,
      subject: "Status Update: Data Scientist, Ads Application — Alex Morgan",
      template: `Hi Meta Recruiting Team,

I am writing to check in on the status of my application for the Data Scientist, Ads role submitted two weeks ago. 

I remain very eager about the opportunity to contribute to Meta's advertiser measurement pipelines and would love to know if any further details are required on my end.

Thank you so much for your time and guidance.

Sincerely,
Alex Morgan`,
    },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const markAsSent = (appId: string) => {
    setSentMap((prev) => ({ ...prev, [appId]: true }));
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BellRing className="w-6 h-6 text-amber-400" />
            <span>Follow-Up Command Center</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Recruiters review dozens of applications daily. Smart, polite follow-ups increase interview conversion by ~34%.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/30 font-semibold py-1">
            {followUpItems.filter((i) => !sentMap[i.app.id]).length} Actions Pending
          </Badge>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card/70 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Optimal Window</div>
              <div className="text-base font-bold text-foreground">5 - 7 Days Post-Apply</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              📈
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Conversion Lift</div>
              <div className="text-base font-bold text-emerald-400">+34% Reply Rate</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              ⏱️
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Avg Recruiter Turnaround</div>
              <div className="text-base font-bold text-foreground">11.4 Days</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Follow-Up Action Queue */}
      <div className="space-y-4">
        {followUpItems.map((item) => {
          const isSent = sentMap[item.app.id];

          return (
            <Card
              key={item.app.id}
              className={`border transition-all ${
                isSent
                  ? "opacity-60 bg-card/40 border-border/50"
                  : item.urgency === "overdue"
                  ? "bg-card/80 border-red-500/40 hover:border-red-500/60"
                  : item.urgency === "today"
                  ? "bg-card/80 border-amber-500/40 hover:border-amber-500/60"
                  : "bg-card/80 border-border/80 hover:border-primary/50"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Company & Meta */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${stringToColor(
                        item.app.company
                      )}`}
                    >
                      {item.app.company[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-foreground">{item.app.company}</h3>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSent
                              ? "bg-emerald-500/20 text-emerald-400"
                              : item.urgency === "overdue"
                              ? "bg-red-500/20 text-red-400"
                              : item.urgency === "today"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isSent
                            ? "✓ Sent"
                            : item.urgency === "overdue"
                            ? "⚠️ Overdue (12+ Days)"
                            : item.urgency === "today"
                            ? "📅 Due Today (7 Days)"
                            : "📋 Upcoming (3 Days)"}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                        {item.app.position} • Applied {relativeTime(item.app.applied_at || item.app.created_at)}
                      </p>

                      {item.app.contact_name && (
                        <p className="text-[11px] text-primary mt-1 flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>Contact: {item.app.contact_name}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2.5 self-end lg:self-center">
                    {isSent ? (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Follow-up recorded
                      </span>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                          className="text-xs border-border"
                        >
                          <Mail className="w-3.5 h-3.5 mr-1.5 text-primary" />
                          View Draft
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => markAsSent(item.app.id)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-sm shadow-primary/20"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          Mark Sent
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Inline Message Preview Snippet */}
                {!isSent && (
                  <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground bg-background/40 p-3 rounded-lg font-mono">
                    <span className="text-[10px] uppercase font-bold text-foreground/80 block mb-1">
                      Subject: {item.subject}
                    </span>
                    <p className="line-clamp-2 italic">"{item.template}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal with Full Email Draft */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-lg bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>AI Polished Follow-Up Message</span>
              </div>
              <DialogTitle className="text-lg font-bold">
                Follow Up with {selectedItem.app.company}
              </DialogTitle>
              <DialogDescription className="text-xs">
                For role: {selectedItem.app.position}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold mb-1">Subject Line</span>
                <div className="p-2.5 rounded-lg bg-background border border-border font-mono text-xs text-foreground">
                  {selectedItem.subject}
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold mb-1">Email Body</span>
                <Textarea
                  rows={9}
                  defaultValue={selectedItem.template}
                  className="font-mono text-xs leading-relaxed bg-background border-border"
                />
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(selectedItem.template)}
                className="text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy Body Text
                  </>
                )}
              </Button>
              <Button
                size="sm"
                onClick={() => markAsSent(selectedItem.app.id)}
                className="bg-primary text-primary-foreground text-xs font-semibold"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Mark as Sent Today
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
