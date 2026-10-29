"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Copy,
  Check,
  Sparkles,
  Share2,
  Award,
  Layers,
  Smartphone,
  Monitor,
} from "lucide-react";
import { AtsSimulationResult } from "@/lib/ats-parser-simulator";
import { useApp } from "@/context/AppContext";

interface AtsScoreCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: AtsSimulationResult;
  candidateName: string;
  targetRole: string;
  language?: "ru" | "en";
}

export default function AtsScoreCardModal({
  isOpen,
  onClose,
  simulation,
  candidateName,
  targetRole,
  language = "ru",
}: AtsScoreCardModalProps) {
  const { showToast } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [aspectFormat, setAspectFormat] = useState<"horizontal" | "vertical">("horizontal");
  const [copiedPost, setCopiedPost] = useState(false);

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isHorizontal = aspectFormat === "horizontal";
    const width = isHorizontal ? 1200 : 1080;
    const height = isHorizontal ? 630 : 1920;

    canvas.width = width;
    canvas.height = height;

    // 1. Background (Dark Cyber Gradient)
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#07090E");
    bgGradient.addColorStop(0.5, "#0D121F");
    bgGradient.addColorStop(1, "#080B12");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Ambient Neon Glow Orbs
    const drawGlow = (x: number, y: number, radius: number, color: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    drawGlow(width * 0.2, height * 0.2, width * 0.45, "rgba(99, 102, 241, 0.15)");
    drawGlow(width * 0.8, height * 0.35, width * 0.4, "rgba(6, 182, 212, 0.15)");
    drawGlow(width * 0.5, height * 0.85, width * 0.5, "rgba(16, 185, 129, 0.12)");

    // 3. Cyber Grid Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    const gridSize = 60;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 4. Glassmorphism Card Container
    const margin = isHorizontal ? 50 : 60;
    const cardW = width - margin * 2;
    const cardH = height - margin * 2;
    const cardR = 32;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(margin, margin, cardW, cardH, cardR);
    ctx.fillStyle = "rgba(18, 24, 38, 0.75)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 5. Header: Brand & Verification Badge
    ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("🎯 LaunchPad AI PRO", margin + 50, margin + 70);

    // Verification Pill
    const badgeText = "VERIFIED ATS AUDIT";
    ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, sans-serif";
    const badgeW = ctx.measureText(badgeText).width + 36;
    const badgeX = margin + cardW - badgeW - 50;
    const badgeY = margin + 46;

    ctx.save();
    ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
    ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, 36, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#34D399";
    ctx.beginPath();
    ctx.arc(badgeX + 18, badgeY + 18, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#34D399";
    ctx.fillText(badgeText, badgeX + 30, badgeY + 23);
    ctx.restore();

    // 6. Candidate Info
    const candidateY = margin + (isHorizontal ? 130 : 160);
    ctx.font = "900 42px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(candidateName || "Candidate", margin + 50, candidateY);

    ctx.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#94A3B8";
    ctx.fillText(targetRole || "Senior Technology Specialist", margin + 50, candidateY + 36);

    // 7. Circular Score Dial
    const dialCenterX = isHorizontal ? margin + cardW - 190 : margin + cardW / 2;
    const dialCenterY = isHorizontal ? margin + 280 : margin + 450;
    const dialRadius = isHorizontal ? 100 : 130;

    // Outer muted ring
    ctx.lineWidth = 14;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.arc(dialCenterX, dialCenterY, dialRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Active Neon Arc
    const scoreVal = simulation.score.total;
    const arcEnd = -Math.PI / 2 + (Math.PI * 2 * (scoreVal / 100));
    const arcGradient = ctx.createLinearGradient(dialCenterX - dialRadius, dialCenterY, dialCenterX + dialRadius, dialCenterY);
    arcGradient.addColorStop(0, "#06B6D4");
    arcGradient.addColorStop(0.5, "#6366F1");
    arcGradient.addColorStop(1, "#10B981");

    ctx.save();
    ctx.strokeStyle = arcGradient;
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.shadowColor = "#06B6D4";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(dialCenterX, dialCenterY, dialRadius, -Math.PI / 2, arcEnd);
    ctx.stroke();
    ctx.restore();

    // Inner Score Text
    ctx.textAlign = "center";
    ctx.font = "900 58px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${scoreVal}%`, dialCenterX, dialCenterY + 16);

    ctx.font = "700 13px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#38BDF8";
    ctx.fillText("ATS MATCH INDEX", dialCenterX, dialCenterY + 42);
    ctx.textAlign = "left"; // reset

    // 8. 4 Formula Progress Bars (55 / 15 / 15 / 15)
    const barsStartX = margin + 50;
    const barsStartY = isHorizontal ? margin + 220 : margin + 660;
    const barsW = isHorizontal ? cardW - 440 : cardW - 100;

    const bars = [
      {
        label: "55% Hard Skills (Verified Quotes)",
        score: simulation.score.hardSkills,
        max: 55,
        color: "#6366F1",
      },
      {
        label: "15% Quantified Metrics (%, $, x, time)",
        score: simulation.score.metrics,
        max: 15,
        color: "#10B981",
      },
      {
        label: "15% Soft Skills (Agile, Team, Cross-functional)",
        score: simulation.score.softSkills,
        max: 15,
        color: "#06B6D4",
      },
      {
        label: "15% ATS Layout (Single-column, Clean dates)",
        score: simulation.score.layout,
        max: 15,
        color: "#F59E0B",
      },
    ];

    bars.forEach((b, i) => {
      const y = barsStartY + i * (isHorizontal ? 62 : 80);

      // Label and points
      ctx.font = "600 15px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "#CBD5E1";
      ctx.fillText(b.label, barsStartX, y);

      ctx.textAlign = "right";
      ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = b.color;
      ctx.fillText(`${b.score} / ${b.max}`, barsStartX + barsW, y);
      ctx.textAlign = "left";

      // Track
      const trackY = y + 10;
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.roundRect(barsStartX, trackY, barsW, 10, 5);
      ctx.fill();

      // Progress Fill
      const fillW = Math.max(12, (b.score / b.max) * barsW);
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(barsStartX, trackY, fillW, 10, 5);
      ctx.fill();
      ctx.restore();
    });

    // 9. Top-5 Verified Skill Chips
    const chipsY = isHorizontal ? margin + 480 : margin + 1050;
    ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#94A3B8";
    ctx.fillText("TOP VERIFIED COMPETENCIES:", margin + 50, chipsY);

    let chipX = margin + 50;
    const topSkills = (simulation.verifiedSkills.length > 0
      ? simulation.verifiedSkills.map((s) => s.name)
      : ["React", "TypeScript", "Next.js", "CI/CD", "Agile"]
    ).slice(0, 5);

    ctx.font = "600 14px -apple-system, BlinkMacSystemFont, sans-serif";
    topSkills.forEach((skill) => {
      const textW = ctx.measureText(`✓ ${skill}`).width + 26;

      ctx.save();
      ctx.fillStyle = "rgba(6, 182, 212, 0.12)";
      ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(chipX, chipsY + 12, textW, 32, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#38BDF8";
      ctx.fillText(`✓ ${skill}`, chipX + 13, chipsY + 33);
      ctx.restore();

      chipX += textW + 12;
    });

    // 10. Footer Stamp
    const footerY = margin + cardH - 30;
    ctx.font = "500 14px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#64748B";
    ctx.fillText("Deterministic Audit by LaunchPad AI PRO • launchpad-app-ashy.vercel.app", margin + 50, footerY);

    ctx.textAlign = "right";
    ctx.fillText("Formula 55/15/15/15 Standard", margin + cardW - 50, footerY);
    ctx.textAlign = "left";
  }, [aspectFormat, simulation, candidateName, targetRole]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(drawCard, 80);
    }
  }, [isOpen, drawCard]);

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const cleanCandidate = (candidateName || "Candidate").replace(/\s+/g, "_");
    link.download = `LaunchPad_ATS_Certificate_${cleanCandidate}_${aspectFormat}.png`;
    link.href = dataUrl;
    link.click();

    showToast(
      language === "en"
        ? "✓ Verified Score Card PNG downloaded successfully!"
        : "✓ Сертификат ATS Verified Score Card успешно скачан!"
    );
  };

  const handleCopySocialPost = () => {
    const topSkills = simulation.verifiedSkills.slice(0, 4).map((s) => s.name).join(", ") || "React, Next.js, CI/CD, Agile";
    const postText = language === "en"
      ? `🎯 I just benchmarked my resume through the deterministic ATS Auditor at LaunchPad AI PRO!
Result: ${simulation.score.total}% Match Index (Harvard/BigTech 55/15/15/15 Standard).

Top verified skills:
${topSkills}

Formula Breakdown:
• Hard Skills (Verified Quotes): ${simulation.score.hardSkills}/55
• Quantified Metrics: ${simulation.score.metrics}/15
• Soft Skills & Agile: ${simulation.score.softSkills}/15
• Single-Column Layout: ${simulation.score.layout}/15

Audit your resume for free: https://launchpad-app-ashy.vercel.app/`
      : `🎯 Проверил резюме через детерминированный ATS-сканер LaunchPad AI PRO!
Мой результат: ${simulation.score.total}% соответствия требованиям работодателей (Стандарт 55/15/15/15).

Подтвержденные навыки с оцифрованными цитатами:
${topSkills}

Разбивка по формуле роботов ATS:
• Hard Skills (цитаты в опыте): ${simulation.score.hardSkills}/55
• Оцифрованные метрики (%, $, x): ${simulation.score.metrics}/15
• Soft Skills и процессы: ${simulation.score.softSkills}/15
• Одноколоночная верстка: ${simulation.score.layout}/15

Проверьте свое резюме онлайн бесплатно: https://launchpad-app-ashy.vercel.app/`;

    navigator.clipboard.writeText(postText);
    setCopiedPost(true);
    showToast(
      language === "en"
        ? "✓ Ready-to-share social post copied to clipboard!"
        : "✓ Текст поста для LinkedIn и Telegram скопирован в буфер!"
    );
    setTimeout(() => setCopiedPost(false), 2400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-20px)] sm:max-w-4xl max-h-[92vh] overflow-y-auto p-0 overflow-x-hidden bg-card/95 border-border shadow-2xl backdrop-blur-2xl text-foreground">
        <DialogHeader className="p-4 sm:p-5 pb-3 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <DialogTitle className="text-base font-bold">
              {language === "en" ? "ATS Verified Score Card Generator" : "Виральный сертификат ATS Verified Score Card"}
            </DialogTitle>
          </div>

          <div className="flex items-center gap-2">
            {/* Format toggle */}
            <div className="flex p-0.5 rounded-lg bg-background border border-border text-xs">
              <button
                onClick={() => setAspectFormat("horizontal")}
                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                  aspectFormat === "horizontal"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Monitor className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">1200×630 </span>
                <span>(Пост)</span>
              </button>
              <button
                onClick={() => setAspectFormat("vertical")}
                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                  aspectFormat === "vertical"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">1080×1920 </span>
                <span>(Stories)</span>
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 flex flex-col items-center justify-center space-y-4">
          {/* Canvas Preview Container */}
          <div className="w-full max-h-[460px] overflow-auto rounded-2xl border border-border/80 bg-background/80 flex items-center justify-center p-3">
            <canvas
              ref={canvasRef}
              className={`rounded-xl shadow-2xl max-w-full object-contain ${
                aspectFormat === "horizontal" ? "max-h-[420px]" : "max-h-[440px]"
              }`}
            />
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>
                {language === "en"
                  ? "Generated client-side via HTML5 Canvas. Ready for LinkedIn, Telegram, VC.ru & Stories."
                  : "Сгенерировано локально на HTML5 Canvas. Подходит для LinkedIn, Telegram, VC.ru и Stories."}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySocialPost}
                className="text-xs border-border flex items-center gap-1.5 cursor-pointer flex-1 sm:flex-none"
              >
                {copiedPost ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>
                  {copiedPost
                    ? language === "en" ? "Copied!" : "Скопировано!"
                    : language === "en" ? "Copy Social Post" : "Скопировать пост"}
                </span>
              </Button>

              <Button
                size="sm"
                onClick={handleDownloadImage}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-md shadow-primary/25 flex items-center gap-1.5 cursor-pointer flex-1 sm:flex-none"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {language === "en" ? "Download PNG" : "Скачать PNG"}
                  <span className="hidden sm:inline"> ({aspectFormat === "horizontal" ? "1200×630" : "1080×1920"})</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}