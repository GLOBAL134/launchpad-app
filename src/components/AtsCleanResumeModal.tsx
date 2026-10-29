"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  FileDown,
  Copy,
  Check,
  Sparkles,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { cleanAIMarkdownArtifacts } from "@/lib/monetization";
import { useApp } from "@/context/AppContext";

interface AtsCleanResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawResumeText: string;
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  targetRole?: string;
  language?: "ru" | "en";
}

export default function AtsCleanResumeModal({
  isOpen,
  onClose,
  rawResumeText,
  candidateName,
  candidateEmail = "alex.morozov@email.ru",
  candidatePhone = "+7 (999) 123-45-67",
  targetRole = "Senior Product Manager",
  language = "ru",
}: AtsCleanResumeModalProps) {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  // Parse raw text into structured Harvard/BigTech single-column standard
  const formattedData = useMemo(() => {
    const cleaned = cleanAIMarkdownArtifacts(rawResumeText);
    const lines = cleaned.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    // Filter out header lines that contain phone or email to avoid duplication
    const bodyLines = lines.filter((l) => {
      const lower = l.toLowerCase();
      if (lower.includes("@") && lower.includes(".")) return false;
      if (/\+7|\+1|\b89\d{9}\b/.test(lower) && lower.length < 50) return false;
      if (lower === candidateName.toLowerCase()) return false;
      return true;
    });

    const bodyText = bodyLines.join("\n\n");

    return {
      name: candidateName || "Алексей Морозов",
      role: targetRole || "Senior Specialist",
      contacts: `${candidateEmail} • ${candidatePhone} • Москва / Remote`,
      content: bodyText,
    };
  }, [rawResumeText, candidateName, candidateEmail, candidatePhone, targetRole]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const textContent = `${formattedData.name.toUpperCase()}
${formattedData.role}
${formattedData.contacts}
================================================================================

${formattedData.content}

--------------------------------------------------------------------------------
Formatted by LaunchPad AI PRO • Harvard/BigTech Single-Column ATS Standard`;

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formattedData.name.replace(/\s+/g, "_")}_ATS_Clean_Resume.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("✓ Чистый текстовый файл (.txt) успешно скачан!");
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# ${formattedData.name}
**${formattedData.role}**
*${formattedData.contacts}*

---

${formattedData.content}

---
*Generated according to Harvard/BigTech ATS Single-Column Standard by [LaunchPad AI PRO](https://launchpad-app-ashy.vercel.app/)*`;

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formattedData.name.replace(/\s+/g, "_")}_ATS_Resume.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("✓ Markdown (.md) файл успешно скачан!");
  };

  const handleCopy = () => {
    const text = `${formattedData.name}
${formattedData.role}
${formattedData.contacts}

${formattedData.content}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("✓ Текст эталонного резюме скопирован в буфер!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card/95 border-border shadow-2xl backdrop-blur-2xl text-foreground max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <DialogHeader className="p-5 pb-3 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <span>Эталонное одноколоночное ATS-резюме</span>
                <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  Harvard / BigTech Standard
                </Badge>
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground">
                100% совместимость с Workday, Taleo, Greenhouse, E-Staff и Поток без склейки колонок
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs border-border flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Скопировано" : "Копировать"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadMarkdown}
              className="text-xs border-border flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-primary" />
              <span>.MD</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTxt}
              className="text-xs border-border flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>.TXT</span>
            </Button>

            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-md shadow-primary/25 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Печать / PDF</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Printable & Scrollable Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-zinc-950/60 print:bg-white print:p-0">
          <div
            id="ats-print-container"
            className="max-w-3xl mx-auto bg-card print:bg-white text-card-foreground print:text-black border border-border/80 print:border-none rounded-xl p-8 sm:p-12 shadow-xl print:shadow-none print:m-0 font-sans"
          >
            {/* Header info */}
            <div className="text-center pb-4 border-b border-border/60 print:border-black/20 space-y-1">
              <h1 className="text-2xl font-black uppercase tracking-wider text-foreground print:text-black">
                {formattedData.name}
              </h1>
              <div className="text-xs font-semibold text-primary print:text-black uppercase tracking-wide">
                {formattedData.role}
              </div>
              <div className="text-xs text-muted-foreground print:text-gray-700 font-mono pt-1">
                {formattedData.contacts}
              </div>
            </div>

            {/* Resume Content formatted single column */}
            <div className="mt-6 text-xs leading-relaxed text-foreground/90 print:text-black space-y-4 whitespace-pre-wrap font-sans">
              {formattedData.content}
            </div>

            {/* Footer validation */}
            <div className="mt-8 pt-4 border-t border-border/40 print:border-black/20 text-[10px] text-muted-foreground print:text-gray-500 text-center flex items-center justify-between">
              <span>Standard 1-Column ATS Template</span>
              <span>LaunchPad AI PRO Verified</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}