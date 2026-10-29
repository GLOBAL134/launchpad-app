"use client";

import { useState, useEffect } from "react";
import { DollarSign, Sparkles, Copy, Check, MessageSquare, Mic, ArrowRight, Loader2, TrendingUp, ShieldCheck } from "lucide-react";
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
  const [offered, setOffered] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"email_chat" | "oral_pitch">("email_chat");

  const [isLoading, setIsLoading] = useState(false);
  const [writtenScript, setWrittenScript] = useState<string | null>(null);
  const [oralScript, setOralScript] = useState<string | null>(null);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // Initialize salary values
  useEffect(() => {
    if (defaultOfferedSalary) {
      const num = typeof defaultOfferedSalary === "number"
        ? defaultOfferedSalary
        : parseInt(String(defaultOfferedSalary).replace(/\D/g, ""), 10) || 120000;
      setOffered(num.toLocaleString("ru-RU"));
      setTarget(Math.round(num * 1.2).toLocaleString("ru-RU"));
    } else {
      setOffered("120 000");
      setTarget("145 000");
    }
  }, [defaultOfferedSalary, open]);

  const handleGenerateScript = async () => {
    setIsLoading(true);

    const userPrompt = `Ты элитный хэдхантер и эксперт по переговорам о компенсации. Подготовь кандидата к торгу по зарплате для позиции «${positionName}» в компании «${companyName}».
    
ИСХОДНЫЕ ДАННЫЕ:
- Предложенная ставка работодателя: ${offered} руб.
- Целевая сумма кандидата (+20%): ${target} руб.
- Опыт и достижения кандидата из резюме:
${resumeText.slice(0, 1500)}

СФОРМИРУЙ ДВА ГОТОВЫХ ТЕКСТА (пиши обычным чистым человеческим текстом БЕЗ звёздочек **, без решёток ###, без лишней воды):

ВАРИАНТ 1: СООБЩЕНИЕ ДЛЯ ПЕРЕПИСКИ ПОСЛЕ ОФФЕРА (Telegram / WhatsApp / Email)
Вежливый, дипломатичный ответ рекрутеру или руководителю после получения оффера. Кандидат благодарит за оффер, подтверждает высокую мотивацию работать именно в ${companyName}, но уверенно аргументирует пожелание по окладу на уровне ${target} руб. через конкретные оцифрованные выгоды (готовность сразу взять сложные участки, прошлые результаты, оптимизация процессов).

ВАРИАНТ 2: УСТНЫЙ ОТВЕТ НА СОБЕСЕДОВАНИИ («КАКИЕ У ВАС ЗАРПЛАТНЫЕ ОЖИДАНИЯ?»)
Дословная 30-секундная шпаргалка, как уверенно ответить рекрутеру при личном разговоре на этапе интервью, зафиксировав вилку вокруг ${target} руб., не продешевив и не отпугнув работодателя.`;

    try {
      const res = await callAI({
        systemPrompt:
          "Ты эксперт по зарплатным переговорам для топ-менеджеров и специалистов. Пиши живые дипломатичные скрипты на русском языке без markdown-разметки.",
        userPrompt,
        temperature: 0.3,
        mode: "salary_negotiator",
      });

      const fullText = res.text || "";

      if (fullText.includes("ВАРИАНТ 2") || fullText.includes("УСТНЫЙ ОТВЕТ")) {
        const parts = fullText.split(/ВАРИАНТ 2:?|УСТНЫЙ ОТВЕТ/i);
        setWrittenScript(parts[0].replace(/ВАРИАНТ 1:?/i, "").trim());
        setOralScript(parts[1]?.trim() || generateFallbackOral(positionName, target));
      } else {
        setWrittenScript(fullText);
        setOralScript(generateFallbackOral(positionName, target));
      }

      onToast("✓ Зарплатный скрипт успешно сгенерирован!");
    } catch (err) {
      console.warn("Salary negotiator AI error:", err);
      setWrittenScript(generateFallbackWritten(companyName, positionName, offered, target));
      setOralScript(generateFallbackOral(positionName, target));
      onToast("Сгенерирован проверенный шаблон переговорного скрипта.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabId);
    onToast("✓ Текст скрипта скопирован в буфер обмена!");
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border text-foreground max-h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              💰
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Генератор торга по зарплате (+15–25% к офферу)
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Как дипломатично и уверенно обосновать повышение оклада через ценность для {companyName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

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
                    placeholder="120 000"
                    className="text-xs font-mono pr-8"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                    ₽
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-emerald-400 block mb-1 flex items-center justify-between">
                  <span>Желаемая сумма (+20% к офферу):</span>
                  <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded font-bold">Цель торга</span>
                </label>
                <div className="relative">
                  <Input
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="145 000"
                    className="text-xs font-mono pr-8 border-emerald-500/40 text-emerald-300 bg-emerald-500/5 font-bold"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-bold">
                    ₽
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
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
                    ИИ формирует аргументы...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Сгенерировать скрипт с ИИ
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Generated Tabs or Welcome Callout */}
          {!writtenScript ? (
            <div className="p-6 border border-dashed border-border rounded-xl text-center space-y-2 text-muted-foreground my-2">
              <DollarSign className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
              <div className="font-semibold text-foreground text-sm">
                Готовы получить на 15–25% больше уже на старте?
              </div>
              <p className="text-xs max-w-md mx-auto leading-relaxed">
                85% работодателей закладывают запас в бюджет вакансии на переговоры, но 70% кандидатов соглашаются на первую названную сумму. Нажмите «Сгенерировать скрипт», чтобы получить дипломатичный ответ.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="grid grid-cols-2 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="email_chat" className="text-xs flex items-center gap-1.5 cursor-pointer">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    1. Сообщение после оффера (Email / Мессенджер)
                  </TabsTrigger>
                  <TabsTrigger value="oral_pitch" className="text-xs flex items-center gap-1.5 cursor-pointer">
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    2. Ответ на интервью голосом
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email_chat" className="space-y-2.5 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      Отправьте в ответ на письмо с оффером или в Telegram рекрутеру:
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(writtenScript, "email_chat")}
                      className="h-7 text-xs border-border cursor-pointer flex items-center gap-1"
                    >
                      {copiedTab === "email_chat" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedTab === "email_chat" ? "Скопировано!" : "Скопировать текст"}</span>
                    </Button>
                  </div>
                  <div className="p-4 rounded-xl bg-background/50 border border-border text-xs leading-relaxed whitespace-pre-wrap font-sans text-foreground">
                    {writtenScript}
                  </div>
                </TabsContent>

                <TabsContent value="oral_pitch" className="space-y-2.5 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      Дословная шпаргалка, как отвечать на вопрос про зарплатные ожидания:
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(oralScript || "", "oral_pitch")}
                      className="h-7 text-xs border-border cursor-pointer flex items-center gap-1"
                    >
                      {copiedTab === "oral_pitch" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedTab === "oral_pitch" ? "Скопировано!" : "Скопировать шпаргалку"}</span>
                    </Button>
                  </div>
                  <div className="p-4 rounded-xl bg-background/50 border border-border text-xs leading-relaxed whitespace-pre-wrap font-sans text-foreground">
                    {oralScript}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer text-muted-foreground"
          >
            Закрыть
          </Button>

          {writtenScript && (
            <Button
              size="sm"
              onClick={() => handleCopy(activeTab === "email_chat" ? writtenScript : oralScript || "", "footer")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Скопировать выбранный скрипт</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateFallbackWritten(company: string, position: string, offered: string, target: string): string {
  return `Здравствуйте, команда ${company}!

Большое спасибо за оффер на позицию «${position}». Мне очень импонируют задачи компании и ваш подход к качеству — я искренне заинтересован в сотрудничестве и готов сразу включиться в ключевые проекты.

Внимательно изучил предложенные условия. С учётом масштаба стоящих передо мной задач, а также моего практического опыта в оптимизации рабочих процессов на предыдущих проектах (где удавалось сократить издержки на 30%+), для меня был бы комфортен фиксированный доход на уровне ${target} рублей на руки.

Уверен, что мой практический бэкграунд позволит закрыть задачи подразделения быстро и без долгого онбординга. Готовы ли вы обсудить возможность пересмотра базовой ставки до этой суммы?

В любом случае буду рад диалогу и открыт к поиску взаимовыгодного решения.`;
}

function generateFallbackOral(position: string, target: string): string {
  return `«Изучив рынок и специфику задач на данной позиции в вашей компании, я ориентируюсь на уровень от ${target} рублей на руки.

Эта планка отражает мой практический опыт решения аналогичных задач без микроменеджмента: на прошлом месте я стабильно выполнял нормативы на 110-125% и наладил сквозные процессы. 

При этом для меня в приоритете масштаб задач и надежность команды, поэтому я готов гибко обсудить структуру общего компенсационного пакета, если есть прозрачная система квартальных бонусов за KPI».`;
}
