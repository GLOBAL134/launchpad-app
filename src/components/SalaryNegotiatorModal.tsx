"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Sparkles,
  Copy,
  Check,
  MessageSquare,
  PhoneCall,
  Loader2,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Building2,
  Briefcase,
  Award,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { callAI } from "@/lib/ai-client";

export interface SalaryArgumentItem {
  id: number;
  title: string;
  description: string;
  metricTag: string;
}

interface SalaryNegotiationPayload {
  arguments: SalaryArgumentItem[];
  telegramScript: string;
  callScript: string;
}

interface SalaryNegotiatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName: string;
  positionName: string;
  resumeText: string;
  defaultOfferedSalary?: number | string;
  onToast: (msg: string) => void;
}

export function SalaryNegotiatorModal({
  open,
  onOpenChange,
  companyName,
  positionName,
  resumeText,
  defaultOfferedSalary,
  onToast,
}: SalaryNegotiatorModalProps) {
  const [offered, setOffered] = useState<string>("180 000");
  const [target, setTarget] = useState<string>("215 000");
  const [activeTab, setActiveTab] = useState<"telegram" | "call">("telegram");

  const [isLoading, setIsLoading] = useState(false);
  const [negotiationData, setNegotiationData] = useState<SalaryNegotiationPayload | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Initialize salary values when opening or when defaultOfferedSalary changes
  useEffect(() => {
    if (defaultOfferedSalary) {
      const num =
        typeof defaultOfferedSalary === "number"
          ? defaultOfferedSalary
          : parseInt(String(defaultOfferedSalary).replace(/\D/g, ""), 10) || 180000;
      setOffered(num.toLocaleString("ru-RU"));
      setTarget(Math.round(num * 1.2).toLocaleString("ru-RU"));
    } else {
      setOffered("180 000");
      setTarget("215 000");
    }
  }, [defaultOfferedSalary, open]);

  // Auto-generate on first open if empty
  useEffect(() => {
    if (open && !negotiationData && !isLoading) {
      handleGenerateScript();
    }
  }, [open]);

  const handleGenerateScript = async () => {
    setIsLoading(true);

    const systemPrompt = `Ты элитный хэдхантер и ментор по компенсациям топ-специалистов. Твоя задача — подготовить кандидата к торгу по зарплате для позиции «${positionName}» в компании «${companyName}».
Предложенная ставка работодателя: ${offered} руб.
Желаемая ставка кандидата (+20–25%): ${target} руб.

На основе резюме кандидата:
1. Сформируй 3 ЖЕЛЕЗОБЕТОННЫХ АРГУМЕНТА на основе оцифрованных метрик из опыта кандидата (окупаемость, оптимизация процессов, экономия времени руководства, закрытие сложных участков).
2. Напиши ГОТОВЫЙ СКРИПТ СООБЩЕНИЯ ДЛЯ HR В TELEGRAM / EMAIL с вежливым, но уверенным обоснованием повышения оффера на +20-25%.
3. Напиши КРАТКИЙ СКРИПТ ДЛЯ ЗВОНКА/ИНТЕРВЬЮ.

Отвечай СТРОГО в формате валидного JSON (без markdown-оберток):
{
  "arguments": [
    {
      "id": 1,
      "title": "Окупаемость инвестиций и оцифрованный результат",
      "description": "Детальный аргумент с конкретными цифрами и метриками из резюме...",
      "metricTag": "+30% к эффективности"
    },
    {
      "id": 2,
      "title": "Автономия и экономия ресурсов руководства",
      "description": "...",
      "metricTag": "Экономия 20ч/мес"
    },
    {
      "id": 3,
      "title": "Готовность зафиксировать повышенные KPI",
      "description": "...",
      "metricTag": "100% гарантия KPI"
    }
  ],
  "telegramScript": "Готовое сообщение для HR...",
  "callScript": "Готовый скрипт для звонка..."
}`;

    const userPrompt = `КОМПАНИЯ: ${companyName}
ДОЛЖНОСТЬ: ${positionName}
БАЗОВАЯ СТАВКА: ${offered} ₽
ЦЕЛЕВАЯ СТАВКА: ${target} ₽

РЕЗЮМЕ КАНДИДАТА:
${resumeText.slice(0, 1600)}

Сформируй 3 железобетонных аргумента и готовые скрипты ответов в формате JSON.`;

    try {
      const res = await callAI({
        systemPrompt,
        userPrompt,
        temperature: 0.3,
        mode: "salary_negotiator",
      });

      const parsed = parseSalaryResponse(res.text, companyName, positionName, offered, target);
      setNegotiationData(parsed);
      onToast("✓ Зарплатный торг и аргументы успешно сформированы!");
    } catch (err) {
      console.warn("Salary negotiator AI error:", err);
      setNegotiationData(getFallbackSalaryData(companyName, positionName, offered, target));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyScript = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onToast("✓ Готовый ответ для HR скопирован в буфер обмена!");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const currentScript =
    activeTab === "telegram"
      ? negotiationData?.telegramScript || ""
      : negotiationData?.callScript || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-20px)] sm:max-w-3xl bg-card border-border text-foreground max-h-[92vh] flex flex-col p-4 sm:p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0 text-base">
                💰
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <span>💰 Торг по зарплате (+20%)</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    +20–25% Boost
                  </span>
                </DialogTitle>
                <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 mt-0.5">
                  <span className="flex items-center gap-1 text-foreground font-medium">
                    <Briefcase className="w-3 h-3 text-emerald-400" />
                    {positionName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Building2 className="w-3 h-3 text-emerald-400" />
                    {companyName}
                  </span>
                </DialogDescription>
              </div>
            </div>

            {negotiationData && !isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateScript}
                className="h-8 text-xs border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Обновить</span>
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1 text-xs">
          {/* Salary inputs box */}
          <div className="p-3.5 bg-muted/40 border border-border/80 rounded-xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Предложение работодателя / Базовый оклад:
                </label>
                <div className="relative">
                  <Input
                    value={offered}
                    onChange={(e) => {
                      setOffered(e.target.value);
                      const num = parseInt(e.target.value.replace(/\D/g, ""), 10);
                      if (num) {
                        setTarget(Math.round(num * 1.2).toLocaleString("ru-RU"));
                      }
                    }}
                    placeholder="180 000"
                    className="text-xs font-mono pr-8 bg-background/80"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                    ₽
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-emerald-400 block mb-1 flex items-center justify-between">
                  <span>Желаемая сумма (+20% к офферу):</span>
                  <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold text-emerald-300">
                    Цель торга
                  </span>
                </label>
                <div className="relative">
                  <Input
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="215 000"
                    className="text-xs font-mono pr-8 border-emerald-500/40 text-emerald-300 bg-emerald-500/5 font-bold"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-bold">
                    ₽
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Прибавка в год:{" "}
                <strong className="text-foreground font-mono">
                  +
                  {(
                    (parseInt(target.replace(/\D/g, "") || "0", 10) -
                      parseInt(offered.replace(/\D/g, "") || "0", 10)) *
                    12
                  ).toLocaleString("ru-RU")}{" "}
                  ₽
                </strong>
              </span>

              <Button
                size="sm"
                onClick={handleGenerateScript}
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8 px-4 font-bold shadow-md shadow-primary/20 cursor-pointer flex items-center gap-1.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ИИ формирует торг...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Пересчитать аргументы
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Generated Content */}
          {isLoading ? (
            <div className="p-8 bg-card/60 border border-border/80 rounded-2xl text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-foreground">
                  ИИ рассчитывает аргументы на основе ваших оцифрованных метрик...
                </h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Формулируем 3 железобетонных довода и дипломатичный скрипт для HR, обосновывающий +20–25% к окладу.
                </p>
              </div>
            </div>
          ) : !negotiationData ? (
            <div className="p-6 border border-dashed border-border rounded-xl text-center space-y-2 text-muted-foreground">
              <DollarSign className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
              <div className="font-semibold text-foreground text-sm">
                Готовы получить на 20% больше уже на старте?
              </div>
              <p className="text-xs max-w-md mx-auto leading-relaxed">
                85% работодателей закладывают запас в бюджет вакансии на переговоры. Нажмите «Пересчитать аргументы», чтобы получить дипломатичный ответ.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* BLOCK 1: 3 Ironclad Arguments */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>3 железобетонных аргумента для повышения оффера:</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    На основе вашего резюме
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {negotiationData.arguments.map((arg, idx) => (
                    <div
                      key={arg.id || idx}
                      className="p-3.5 rounded-xl border border-border/80 bg-background/70 space-y-1.5 hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0 border border-emerald-500/30">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-xs text-foreground">
                            {arg.title}
                          </span>
                        </div>
                        {arg.metricTag && (
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shrink-0">
                            {arg.metricTag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-7">
                        {arg.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* BLOCK 2: Ready-Made HR Script with Big Copy Button */}
              <div className="space-y-2.5 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>Готовый скрипт ответа для HR:</span>
                  </h4>
                  <Button
                    size="sm"
                    onClick={() => handleCopyScript(currentScript, "top")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold h-7 px-3 cursor-pointer shadow-sm shadow-emerald-600/30 flex items-center gap-1.5"
                  >
                    {copiedKey === "top" ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {copiedKey === "top"
                        ? "Скопировано в буфер!"
                        : "📋 Скопировать готовый ответ для HR"}
                    </span>
                  </Button>
                </div>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                  <TabsList className="grid grid-cols-2 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger
                      value="telegram"
                      className="text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-primary" />
                      <span>Сообщение в Telegram / Email</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="call"
                      className="text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Скрипт для звонка / Интервью</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="telegram" className="mt-2.5 space-y-2">
                    <div className="p-4 rounded-xl bg-background/80 border border-border text-xs leading-relaxed whitespace-pre-wrap font-sans text-foreground">
                      {negotiationData.telegramScript}
                    </div>
                  </TabsContent>

                  <TabsContent value="call" className="mt-2.5 space-y-2">
                    <div className="p-4 rounded-xl bg-background/80 border border-border text-xs leading-relaxed whitespace-pre-wrap font-sans text-foreground">
                      {negotiationData.callScript}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer text-muted-foreground"
          >
            Закрыть
          </Button>

          {negotiationData && (
            <Button
              size="sm"
              onClick={() => handleCopyScript(currentScript, "footer")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 cursor-pointer flex items-center gap-1.5 px-4 h-8"
            >
              {copiedKey === "footer" ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>
                {copiedKey === "footer"
                  ? "Скопировано в буфер!"
                  : "📋 Скопировать готовый ответ для HR"}
              </span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Parses LLM response into arguments + scripts */
function parseSalaryResponse(
  rawText: string,
  company: string,
  position: string,
  offered: string,
  target: string
): SalaryNegotiationPayload {
  if (!rawText) return getFallbackSalaryData(company, position, offered, target);

  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed.arguments) && parsed.arguments.length > 0) {
        return {
          arguments: parsed.arguments.slice(0, 3).map((a: any, idx: number) => ({
            id: a.id || idx + 1,
            title: a.title || `Аргумент #${idx + 1}`,
            description: a.description || "",
            metricTag: a.metricTag || "+20% ценности",
          })),
          telegramScript: parsed.telegramScript || getFallbackTelegramScript(company, position, target),
          callScript: parsed.callScript || getFallbackCallScript(company, position, target),
        };
      }
    }
  } catch (err) {
    console.warn("Salary JSON parse error:", err);
  }

  // Fallback text parsing if not strict JSON
  return getFallbackSalaryData(company, position, offered, target);
}

/** Fallback payload with high-impact arguments based on candidate resume */
function getFallbackSalaryData(
  company: string,
  position: string,
  offered: string,
  target: string
): SalaryNegotiationPayload {
  return {
    arguments: [
      {
        id: 1,
        title: "Окупаемость инвестиций и оцифрованный финансовый эффект",
        description: `На предыдущих проектах оптимизация рабочих процессов позволила сократить временные издержки на 30%+ и исключить финансовые риски. Повышение ставки на 20% полностью окупается в первый квартал за счёт предотвращения ошибок и скорости решения задач.`,
        metricTag: "+30% к эффективности",
      },
      {
        id: 2,
        title: "Полная автономия и экономия времени руководства",
        description: `Глубокая экспертиза в профильном стеке позволяет включиться в боевые задачи со второй недели без многомесячного обучения, экономя от 15 до 20 часов времени руководства ${company} ежемесячно.`,
        metricTag: "Экономия 20ч/мес",
      },
      {
        id: 3,
        title: "Готовность зафиксировать повышенные KPI на испытательный срок",
        description: `Кандидат берет на себя наиболее ответственные участки в ${company} и соглашается привязать повышенную компенсацию к прозрачным измеримым бизнес-результатам.`,
        metricTag: "100% привязка к KPI",
      },
    ],
    telegramScript: getFallbackTelegramScript(company, position, target),
    callScript: getFallbackCallScript(company, position, target),
  };
}

function getFallbackTelegramScript(company: string, position: string, target: string): string {
  return `Здравствуйте! Большое спасибо за оффер на позицию «${position}» и доверие к моему профессиональному уровню. Мне очень импонируют задачи компании ${company} и ваш подход к качеству — я искренне заинтересован в сотрудничестве и готов сразу включиться в ключевые проекты.

Внимательно изучил предложенные условия. С учётом масштаба стоящих передо мной задач, а также моего практического опыта в оптимизации рабочих процессов (где удавалось повысить операционную эффективность на 30%+), для меня был бы комфортен фиксированный доход на уровне ${target} руб. на руки.

При таком уровне компенсации я готов зафиксировать повышенные KPI на испытательный срок и взять на себя наиболее сложные участки. Подскажите, есть ли у компании возможность согласовать эту планку?

В любом случае очень ценю наш диалог и открыт к обсуждению структуры предложения!`;
}

function getFallbackCallScript(company: string, position: string, target: string): string {
  return `«Я внимательно проанализировал объем задач на позиции «${position}» и вижу, как могу принести компании ощутимый результат уже в первые месяцы за счет оптимизации процессов. Чтобы мы оба были на 100% довольны условиями, готов ли бизнес рассмотреть планку ${target} руб. net? С моей стороны гарантирую полную отдачу, закрытие задач без микроменеджмента и выполнение всех ключевых KPI».`;
}
