"use client";

import { useState } from "react";
import {
  PenTool,
  Sparkles,
  Copy,
  Check,
  Download,
  FileText,
  RotateCcw,
  Send,
  Sliders,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const SAMPLE_GENERATED_LETTER = `Dear Google Hiring Team,

I am writing to express my strong enthusiasm for the Senior Product Manager, Cloud Infrastructure & AI position. Having followed Google Cloud's advancements in generative developer tools, I am eager to contribute my background in scaling distributed developer platforms and accelerating enterprise release velocity.

Over the past five years at CloudScale Solutions and FinTech Global, I have led cross-functional product teams of 12+ engineers and designers to launch enterprise SaaS products that scaled from 0 to over 40,000 daily active users. Most recently, I championed an AI-assisted analytics pipeline that cut query latency by 45% and reduced time-to-value for enterprise customers from three weeks to under 48 hours. I thrive at the intersection of technical architecture, data-driven A/B experimentation, and close stakeholder alignment.

Google's commitment to building open, reliable infrastructure for the world's most critical workloads deeply resonates with my professional ethos. I welcome the opportunity to discuss how my hands-on experience with Agile CI/CD workflows and developer-first product management can help Google Cloud empower millions of builders globally.

Thank you for your time and consideration.

Warm regards,
Alex Morgan
alex.morgan@email.com | (555) 234-5678`;

export default function CoverLetterPage() {
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("Senior Product Manager");
  const [tone, setTone] = useState("professional");
  const [keyAchievement, setKeyAchievement] = useState(
    "Led cross-functional team scaling enterprise SaaS from 0 to 40k DAU, cut latency by 45% with AI analytics."
  );
  const [letterContent, setLetterContent] = useState(SAMPLE_GENERATED_LETTER);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setLetterContent(
        `Dear ${company} Hiring Team,\n\nI am writing to express my strong interest in the ${role} position. With my background in leading product initiatives and scaling impactful platforms, I am eager to bring my expertise to the team at ${company}.\n\nSpecifically, ${keyAchievement} My approach combines rigorous data-driven experimentation with empathetic user research to ensure that engineering output directly translates into customer value.\n\nI admire ${company}'s standard of excellence and would value the opportunity to discuss how my skill set can support your upcoming roadmap.\n\nThank you for your review and consideration.\n\nSincerely,\nAlex Morgan`
      );
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([letterContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${company}_Cover_Letter_${role.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <PenTool className="w-6 h-6 text-primary" />
          <span>Smart Cover Letter Studio</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate human-sounding, role-specific letters in seconds. Tailored to the company mission, tone, and your key wins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-card/70 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <span>Job & Letter Parameters</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Provide details for the AI drafting engine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div>
                <Label htmlFor="company-name" className="text-xs">Company Name</Label>
                <Input
                  id="company-name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, Linear, Notion"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="role-name" className="text-xs">Target Position</Label>
                <Input
                  id="role-name"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Product Manager"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="tone-select" className="text-xs">Tone of Voice</Label>
                <Select value={tone} onValueChange={(val) => val && setTone(val)}>
                  <SelectTrigger id="tone-select" className="mt-1 text-xs">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">👔 Professional & Balanced</SelectItem>
                    <SelectItem value="bold">🚀 Confident & High-Impact</SelectItem>
                    <SelectItem value="concise">⚡ Concise & Direct (3 Paragraphs)</SelectItem>
                    <SelectItem value="startup">💡 Passionate & Startup-Driven</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="achievement" className="text-xs">
                  Key Achievement or Experience to Highlight
                </Label>
                <Textarea
                  id="achievement"
                  rows={4}
                  value={keyAchievement}
                  onChange={(e) => setKeyAchievement(e.target.value)}
                  placeholder="e.g. Led redesign increasing user retention by 22%..."
                  className="mt-1 text-xs resize-y"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-md shadow-primary/20 h-10"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Crafting Letter...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Tailored Letter
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Output Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-card/70 border-border">
            <CardHeader className="pb-3 border-b border-border/70 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Generated Cover Letter</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Editable preview • {letterContent.split(/\s+/).filter(Boolean).length} words • ~1 min read
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 text-xs font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Copy
                    </>
                  )}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 text-xs font-medium"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Export .TXT
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <Textarea
                rows={16}
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                className="font-mono text-xs leading-relaxed bg-background/50 border-border p-4 rounded-xl resize-y"
              />

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                <span className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    Ready to send
                  </Badge>
                  <span>Format: Single column plain text ATS compliant</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLetterContent(SAMPLE_GENERATED_LETTER)}
                  className="h-7 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
