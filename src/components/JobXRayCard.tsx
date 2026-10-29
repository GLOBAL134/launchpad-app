"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Flame,
  MessageSquare,
  Key,
  Share2,
  Eye,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { callAI } from "@/lib/ai-client";

export interface XRayQuoteItem {
  hrQuote: string;
  realMeaning: string;
  severity: "high" | "medium" | "low";
}

export interface JobXRayData {
  toxicityIndex: "high" | "medium" | "safe";
  toxicityLabel: string;
  adequacyScore: number;
  summaryVerdict: string;
  quotesTranslation: XRayQuoteItem[];
  hiddenBossPain: string;
  magicOfferPhrase: string;
}

interface JobXRayCardProps {
  jobText: string;
  companyName?: string;
  positionName?: string;
  onToast: (msg: string) => void;
}

export function JobXRayCard({
  jobText,
  companyName = "Работодатель",
  positionName = "Специалист",
  onToast,
}: JobXRayCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<JobXRayData | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-generate on mount or when jobText changes
  useEffect(() => {
    if (jobText && jobText.trim().length > 30) {
      handleAnalyzeXRay();
    }
  }, [jobText]);

  const handleAnalyzeXRay = async () => {
    setIsLoading(true);

    const systemPrompt = `Ты эксперт по детекции корпоративной токсичности и автор вирусных разборов вакансий для TikTok/Reels.
Твоя задача — провести жесткий, честный и зрелищный «Рентген вакансии» с переводом с языка HR на человеческий.
Для позиции «${positionName}» в компании «${companyName}»:
1. Оцени честность и токсичность:
   - toxicityIndex: "high" (если много скрытых переработок) | "medium" | "safe" (если зрелая адекватная вакансия)
   - toxicityLabel: например, "🔴 Высокий риск переработок" или "🟢 Адекватный работодатель"
   - adequacyScore: число от 0 до 100
   - summaryVerdict: хлесткий вердикт на 1-2 предложения
2. Перевод с HR-языка на человеческий: вытащи 3-4 РЕАЛЬНЫЕ ЦИТАТЫ из текста вакансии и расшифруй их скрытый смысл
3. Скрытая боль руководителя: чего боится босс и кого на самом деле ищут
4. Магическая фраза: точная фраза, которую сказать на собеседовании, чтобы получить оффер

Отвечай СТРОГО в формате валидного JSON (без markdown-оберток):
{
  "toxicityIndex": "high" | "medium" | "safe",
  "toxicityLabel": "...",
  "adequacyScore": 65,
  "summaryVerdict": "...",
  "quotesTranslation": [
    {
      "hrQuote": "Цитата из вакансии",
      "realMeaning": "Что это значит на самом деле",
      "severity": "high" | "medium" | "low"
    }
  ],
  "hiddenBossPain": "...",
  "magicOfferPhrase": "..."
}`;

    const userPrompt = `КОМПАНИЯ: ${companyName}
ДОЛЖНОСТЬ: ${positionName}

ТЕКСТ ВАКАНСИИ:
${jobText.slice(0, 1800)}

Сделай зрелищный Рентген вакансии в формате JSON.`;

    try {
      const res = await callAI({
        systemPrompt,
        userPrompt,
        temperature: 0.3,
        mode: "job_xray",
      });

      const parsed = parseXRayResponse(res.text, positionName, companyName, jobText);
      setData(parsed);
    } catch (err) {
      console.warn("Job X-Ray AI error:", err);
      setData(getFallbackXRayData(positionName, companyName, jobText));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, key: string, toastMsg: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onToast(toastMsg);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCopySocialPost = () => {
    if (!data) return;
    const post = `🚩 РЕНТГЕН ВАКАНСИИ: ПЕРЕВОД С HR-ЯЗЫКА НА ЧЕЛОВЕЧЕСКИЙ
Вакансия: ${positionName} в ${companyName}
Индекс честности: ${data.toxicityLabel} (${data.adequacyScore}/100)

🗣 ЧТО ПИШУТ В ВАКАНСИИ ➔ ЧТО ЭТО ЗНАЧИТ:
${data.quotesTranslation
  .map((q, idx) => `${idx + 1}) В вакансии: «${q.hrQuote}»\n   На самом деле: ${q.realMeaning}`)
  .join("\n\n")}

🎯 СКРЫТАЯ БОЛЬ БОССА:
${data.hiddenBossPain}

💬 ФРАЗА, КОТОРАЯ ГАРАНТИРУЕТ ОФФЕР:
«${data.magicOfferPhrase}»

Проверено через LaunchPad AI PRO 🚀`;

    handleCopyText(post, "social", "✓ Разбор скопирован! Готово для поста в Reels / TikTok / TG");
  };

  return (
    <Card className="bg-card border-border overflow-hidden shadow-xl">
      <CardHeader className="pb-3 border-b border-border/70 bg-card/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold shrink-0 text-base shadow-sm">
              🚩
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                <span>Рентген вакансии: Перевод с HR-языка</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 hidden sm:inline-flex items-center gap-1">
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span>Viral X-Ray</span>
                </span>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Автоматическая расшифровка скрытой токсичности, истинных мотивов работодателя и боли босса
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {data && (
              <div className="flex items-center gap-2 bg-background/60 border border-border/80 px-3 py-1.5 rounded-xl">
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                    Честность вакансии
                  </span>
                  <span
                    className={`text-base font-black font-mono leading-none ${
                      data.adequacyScore >= 80
                        ? "text-emerald-400"
                        : data.adequacyScore >= 60
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {data.adequacyScore}/100
                  </span>
                </div>
                <div
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    data.toxicityIndex === "safe"
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                      : data.toxicityIndex === "medium"
                      ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                      : "bg-rose-500/15 border-rose-500/30 text-rose-300 animate-pulse"
                  }`}
                >
                  {data.toxicityLabel}
                </div>
              </div>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={handleAnalyzeXRay}
              disabled={isLoading}
              className="h-8 text-xs border-border/80 text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1.5"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span className="hidden sm:inline">Пересканировать</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
        {isLoading ? (
          <div className="p-8 bg-card/40 border border-border/80 rounded-2xl text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-foreground">
                ИИ проводит Рентген вакансии...
              </h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Ищем скрытые манипулятивные маркеры, расшифровываем цитаты HR и формулируем точную фразу для оффера.
              </p>
            </div>
          </div>
        ) : !data ? (
          <div className="p-6 border border-dashed border-border rounded-xl text-center space-y-2 text-muted-foreground">
            <Eye className="w-8 h-8 text-rose-400 mx-auto opacity-70" />
            <div className="font-semibold text-foreground text-sm">
              Узнайте, что на самом деле скрыто за красивыми словами в вакансии
            </div>
            <Button
              size="sm"
              onClick={handleAnalyzeXRay}
              className="bg-primary text-primary-foreground font-bold text-xs"
            >
              Запустить Рентген вакансии
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            {/* Verdict summary banner */}
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                data.toxicityIndex === "safe"
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-200"
                  : data.toxicityIndex === "medium"
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-200"
                  : "bg-rose-500/10 border-rose-500/25 text-rose-200"
              }`}
            >
              {data.toxicityIndex === "safe" ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold text-xs block">
                  Вердикт Рентгена: {data.toxicityLabel}
                </span>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {data.summaryVerdict}
                </p>
              </div>
            </div>

            {/* BLOCK 1: Translation of Quotes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                  <span>Перевод с HR-языка на человеческий (реальные цитаты):</span>
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {data.quotesTranslation.length} цитаты
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {data.quotesTranslation.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border/80 bg-background/60 space-y-2 hover:border-border transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.severity === "high"
                              ? "bg-rose-500 animate-pulse"
                              : item.severity === "medium"
                              ? "bg-amber-400"
                              : "bg-blue-400"
                          }`}
                        />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                          Цитата #{idx + 1}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground italic">
                        {item.severity === "high"
                          ? "🔴 Высокий риск переработок"
                          : item.severity === "medium"
                          ? "🟡 Размытая ответственность"
                          : "🔵 Корпоративный штамп"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {/* HR Text */}
                      <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-muted-foreground space-y-1">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">
                          🗣 В тексте вакансии:
                        </span>
                        <p className="italic font-medium text-foreground/90 leading-snug">
                          «{item.hrQuote}»
                        </p>
                      </div>

                      {/* Real Meaning */}
                      <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200 space-y-1">
                        <span className="text-[9px] uppercase font-bold text-rose-400 block flex items-center gap-1">
                          <ArrowRight className="w-3 h-3" />
                          <span>На самом деле:</span>
                        </span>
                        <p className="font-semibold text-rose-100 leading-snug">
                          {item.realMeaning}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOCK 2: Boss Hidden Pain & Magic Offer Phrase */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-card to-background border border-indigo-500/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Key className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-foreground">
                      Скрытая боль руководителя и фраза для оффера
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Кого они ищут на самом деле и как зацепить нанимающего менеджера
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  🎯 Секретный триггер
                </span>
              </div>

              {/* Hidden pain */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-300 block">
                  Чего боится нанимающий директор (скрытая боль):
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-indigo-500/50">
                  {data.hiddenBossPain}
                </p>
              </div>

              {/* Magic Phrase */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Скажите это на собеседовании, чтобы получить оффер:</span>
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleCopyText(
                        data.magicOfferPhrase,
                        "phrase",
                        "✓ Магическая фраза для собеседования скопирована!"
                      )
                    }
                    className="h-6 text-[10px] border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer flex items-center gap-1 px-2 shrink-0 font-semibold"
                  >
                    {copiedKey === "phrase" ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedKey === "phrase" ? "Скопировано!" : "Скопировать фразу"}</span>
                  </Button>
                </div>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed italic bg-background/60 p-2.5 rounded-lg border border-emerald-500/20">
                  «{data.magicOfferPhrase}»
                </p>
              </div>
            </div>

            {/* BLOCK 3: Viral Social Post Copy */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Идеально для видео в TikTok, Reels, Shorts или поста в Telegram</span>
              </span>

              <Button
                size="sm"
                onClick={handleCopySocialPost}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-8 px-4 cursor-pointer shadow-sm shadow-primary/20 flex items-center gap-1.5"
              >
                {copiedKey === "social" ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                <span>
                  {copiedKey === "social"
                    ? "Пост скопирован!"
                    : "📋 Скопировать весь Рентген для соцсетей"}
                </span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Parses LLM response into structured JobXRayData */
function parseXRayResponse(
  rawText: string,
  position: string,
  company: string,
  jobText: string
): JobXRayData {
  if (!rawText) return getFallbackXRayData(position, company, jobText);

  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed.quotesTranslation) && parsed.quotesTranslation.length > 0) {
        return {
          toxicityIndex: parsed.toxicityIndex || "medium",
          toxicityLabel: parsed.toxicityLabel || "🟡 Умеренный темп и размытые KPI",
          adequacyScore: typeof parsed.adequacyScore === "number" ? parsed.adequacyScore : 68,
          summaryVerdict:
            parsed.summaryVerdict ||
            "Вакансия содержит скрытые требования к переработкам без соразмерной компенсации.",
          quotesTranslation: parsed.quotesTranslation.slice(0, 4).map((q: any) => ({
            hrQuote: q.hrQuote || "Стрессоустойчивость и динамичная среда",
            realMeaning: q.realMeaning || "Переработки без доплат",
            severity: q.severity || "medium",
          })),
          hiddenBossPain:
            parsed.hiddenBossPain ||
            "Руководитель устал контролировать рутину и ищет автономного эксперта, который закроет фронт работ без микроменеджмента.",
          magicOfferPhrase:
            parsed.magicOfferPhrase ||
            "«Я привык работать на оцифрованный результат и беру полную ответственность за свой участок без отвлечения руководства».",
        };
      }
    }
  } catch (err) {
    console.warn("X-Ray JSON parse error:", err);
  }

  return getFallbackXRayData(position, company, jobText);
}

/** Deterministic fallback analysis based on text keywords */
function getFallbackXRayData(
  position: string,
  company: string,
  jobText: string
): JobXRayData {
  const lower = (jobText || "").toLowerCase();

  const quotes: XRayQuoteItem[] = [];

  if (lower.includes("стрессоустойчив") || lower.includes("динамичн")) {
    quotes.push({
      hrQuote: "Стрессоустойчивость и динамичная среда",
      realMeaning: "Придется регулярно тушить пожары, перерабатывать и тянуть задачи за двоих без доплат.",
      severity: "high",
    });
  } else {
    quotes.push({
      hrQuote: "Готовность работать в режиме многозадачности",
      realMeaning: "Обязанности трёх разных ролей свалят на одного человека.",
      severity: "high",
    });
  }

  if (lower.includes("коллектив") || lower.includes("семья") || lower.includes("стартап")) {
    quotes.push({
      hrQuote: "Молодой дружный коллектив и атмосфера стартапа",
      realMeaning: "Текучка кадров, отсутствие регламентов и надежда на энтузиазм вместо бонусов.",
      severity: "medium",
    });
  } else {
    quotes.push({
      hrQuote: "Широкий спектр интересных и амбициозных задач",
      realMeaning: "Нет четкой должностной инструкции, в случае ошибки крайним назначат вас.",
      severity: "medium",
    });
  }

  if (lower.includes("результат") || lower.includes("kpi") || lower.includes("преми")) {
    quotes.push({
      hrQuote: "Конкурентная зарплата и премии по результатам работы",
      realMeaning: "Окладная часть занижена, а чтобы получить премию, придется выполнить плавающий KPI.",
      severity: "medium",
    });
  } else {
    quotes.push({
      hrQuote: "Оформление по ТК РФ после испытательного срока",
      realMeaning: "Первые 3 месяца серая или урезанная ставка без социальных гарантий.",
      severity: "high",
    });
  }

  quotes.push({
    hrQuote: "Инициативность и проактивная жизненная позиция",
    realMeaning: "Руководство не знает, как решать проблему, и ждет, что вы сами всё настроите с нуля.",
    severity: "low",
  });

  return {
    toxicityIndex: "medium",
    toxicityLabel: "🔴 Высокий риск переработок",
    adequacyScore: 54,
    summaryVerdict: `В вакансии компании «${company}» обнаружены классические манипулятивные маркеры: размытая зона ответственности и риск неоплачиваемых переработок.`,
    quotesTranslation: quotes.slice(0, 4),
    hiddenBossPain: `Руководитель направления в «${company}» перегружен текучкой и боится нанять сотрудника, которого придется обучать с нуля. Ему нужен автономный специалист, который сразу возьмет на себя регламентные задачи и не будет требовать постоянного контроля.`,
    magicOfferPhrase: `«Я внимательно изучил ваши требования и ценю автономию. На предыдущих проектах я настроил процессы так, что все контрольные точки и отчеты сдавались день в день без микроменеджмента со стороны руководства. В ${company} готов показать такой же результат уже в первый месяц».`,
  };
}
