"use client";

import { useState } from "react";
import { Sparkles, Check, Loader2, Copy, HelpCircle, MessageSquare, Target, DollarSign, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { callAI } from "@/lib/ai-client";

interface AiInterviewPrepModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: string;
  position: string;
  resumeText: string;
  jobDesc: string;
}

export function AiInterviewPrepModal({
  open,
  onOpenChange,
  company,
  position,
  resumeText,
  jobDesc,
}: AiInterviewPrepModalProps) {
  const [activeTab, setActiveTab] = useState<"questions" | "pitch" | "salary">("questions");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [qaContent, setQaContent] = useState<string | null>(null);
  const [pitchContent, setPitchContent] = useState<string | null>(null);
  const [salaryContent, setSalaryContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);

    const userPrompt = `Ты топ-хэдхантер и нанимающий директор. Подготовь кандидата к собеседованию на позицию «${position}» в компанию «${company}».
    
ВАКАНСИЯ:
${jobDesc.slice(0, 1500)}

РЕЗЮМЕ КАНДИДАТА:
${resumeText.slice(0, 1500)}

СФОРМИРУЙ 3 БЛОКА (пиши обычным чистым текстом без символов **, без ###, без ---):

БЛОК 1: ТОП-5 ВОПРОСОВ И СИЛЬНЫХ ОТВЕТОВ
Сформулируй 5 самых острых практических вопросов, которые гарантированно зададут кандидату на этой должности (с учетом специфики профессии: бухгалтерия, продажи, маркетинг, юриспруденция, логистика, IT или руководство). На каждый вопрос дай идеальный ответ по формуле STAR (Ситуация - Задача - Действие - Результат) с опорой на цифры из резюме.

БЛОК 2: ОТВЕТ НА ВОПРОС «ПОЧЕМУ МЫ ДОЛЖНЫ ВЫБРАТЬ ВАС?»
Емкий, уверенный 30-секундный монолог (Elevator Pitch) без шаблонных фраз («я стрессоустойчивый»), а на языке выгод для бизнеса компании ${company}.

БЛОК 3: ПЕРЕГОВОРЫ О ЗАРПЛАТЕ
Как правильно назвать и аргументировать свои зарплатные ожидания, если рекрутер спросит «На какую сумму вы рассчитываете?».`;

    try {
      const res = await callAI({
        systemPrompt:
          "Ты элитный карьерный коуч и нанимающий директор. Формируй готовый сценарий собеседования без markdown-звёздочек и решёток.",
        userPrompt,
        temperature: 0.3,
        mode: "text",
      });

      const fullText = res.text || "";

      // Split into 3 sections
      if (fullText.includes("БЛОК 2") || fullText.includes("БЛОК 3")) {
        const parts = fullText.split(/БЛОК \d:?/i);
        setQaContent(parts[1]?.trim() || fullText);
        setPitchContent(parts[2]?.trim() || "Ответ готов");
        setSalaryContent(parts[3]?.trim() || "Рекомендации готовы");
      } else {
        setQaContent(fullText);
        setPitchContent(generateFallbackPitch(company, position));
        setSalaryContent(generateFallbackSalary(position));
      }
    } catch (err) {
      console.warn("Interview prep AI error:", err);
      setQaContent(generateFallbackQa(position));
      setPitchContent(generateFallbackPitch(company, position));
      setSalaryContent(generateFallbackSalary(position));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAll = () => {
    const all = `КОНСПЕКТ ПОДГОТОВКИ К СОБЕСЕДОВАНИЮ
Должность: ${position} | Компания: ${company}

ВОПРОСЫ И ОТВЕТЫ:
${qaContent || ""}

ELEVATOR PITCH (ПОЧЕМУ МЫ ДОЛЖНЫ ВАС ВЗЯТЬ):
${pitchContent || ""}

ЗАРПЛАТНЫЙ ТОРГ:
${salaryContent || ""}`;

    navigator.clipboard.writeText(all);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border text-foreground max-h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Экспресс-подготовка к собеседованию с ИИ
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Персональный разбор вопросов, готовых ответов и зарплатного торга для «{position}» в {company}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1 text-xs">
          {!qaContent ? (
            <div className="p-6 bg-card/60 border border-border/80 rounded-2xl text-center space-y-4 my-auto">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-foreground">
                  Готовы узнать вопросы, которые вам точно зададут?
                </h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Нейросеть сопоставит требования вакансии и ваш опыт, чтобы подготовить сильные аргументы, оцифрованные примеры и идеальный Elevator Pitch.
                </p>
              </div>

              <Button
                size="sm"
                disabled={isLoading}
                onClick={handleGenerate}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-md shadow-primary/25 cursor-pointer px-6 py-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ИИ анализирует вакансию и моделирует интервью...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Сгенерировать конспект интервью с ИИ
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="grid grid-cols-3 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="questions" className="text-xs flex items-center gap-1.5 cursor-pointer">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Вопросы и ответы
                  </TabsTrigger>
                  <TabsTrigger value="pitch" className="text-xs flex items-center gap-1.5 cursor-pointer">
                    <UserCheck className="w-3.5 h-3.5" />
                    «Почему именно я?»
                  </TabsTrigger>
                  <TabsTrigger value="salary" className="text-xs flex items-center gap-1.5 cursor-pointer">
                    <DollarSign className="w-3.5 h-3.5" />
                    Зарплатный торг
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="questions" className="space-y-2 mt-3">
                  <div className="p-4 bg-background/50 border border-border rounded-xl leading-relaxed whitespace-pre-wrap font-sans text-xs">
                    {qaContent}
                  </div>
                </TabsContent>

                <TabsContent value="pitch" className="space-y-2 mt-3">
                  <div className="p-4 bg-background/50 border border-border rounded-xl leading-relaxed whitespace-pre-wrap font-sans text-xs">
                    {pitchContent}
                  </div>
                </TabsContent>

                <TabsContent value="salary" className="space-y-2 mt-3">
                  <div className="p-4 bg-background/50 border border-border rounded-xl leading-relaxed whitespace-pre-wrap font-sans text-xs">
                    {salaryContent}
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

          {qaContent && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isLoading}
                className="text-xs cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Перегенерировать"}
              </Button>

              <Button
                size="sm"
                onClick={handleCopyAll}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Скопировано!" : "Скопировать весь конспект"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateFallbackQa(position: string): string {
  return `1. «Расскажите о самом сложном профессиональном вызове на предыдущем месте и как вы его решили?»
Идеальный ответ (STAR):
• Ситуация: Подразделение столкнулось с ростом нагрузки и риском срыва сроков регламентных задач на 25%.
• Задача: Быстро оптимизировать процессы без найма дополнительных сотрудников и раздувания ФОТ.
• Действие: Провел аудит узких мест, стандартизировал типовые операции и внедрил сквозной контроль качества.
• Результат: Сократил время выполнения циклов на 32% и обеспечил 100% выполнение целевых показателей.

2. «Какими профессиональными инструментами и регламентами вы владеете на уровне эксперта?»
Идеальный ответ:
«Я глубоко владею профильным инструментарием, применяю современные стандарты отрасли и умею быстро адаптировать новые методологии под специфику бизнеса без потери эффективности».

3. «Как вы действуете, если приоритеты руководства внезапно меняются в середине проекта?»
Идеальный ответ:
«Сохраняю конструктивный фокус. Оперативно оцениваю влияние изменений на сроки и ресурсы, фиксирую обновленные договоренности и перераспределяю задачи, удерживая общую цель бизнеса в приоритете».

4. «Приведите пример, когда вы предотвратили критическую ошибку или финансовые потери?»
Идеальный ответ:
«Благодаря внедренной системе двойного контроля и превентивной проверке данных мне удалось выявить нестыковки на раннем этапе, что предотвратило операционные сбои и сохранило компании ресурсы».

5. «Что вас больше всего привлекает в нашей компании и этой роли?»
Идеальный ответ:
«Масштаб задач и подход к качеству. Вижу прямое пересечение моих практических навыков с вашими целями на ближайший год — готов сразу включиться в решение ключевых вопросов без долгой раскачки».`;
}

function generateFallbackPitch(company: string, position: string): string {
  return `«Вы должны выбрать меня, потому что мой практический опыт в роли «${position}» напрямую закрывает ваши ключевые потребности. 

На прошлых проектах я стабильно обеспечивал рост эффективности на 25-35%, умею работать с оцифрованным результатом и не требую микроменеджмента. Для ${company} я стану надежным сотрудником, который не просто выполняет задачи по регламенту, а видит узкие места, предлагает решения и помогает компании быстрее достигать финансовых и операционных целей».`;
}

function generateFallbackSalary(position: string): string {
  return `СТРАТЕГИЯ ЗАРПЛАТНОГО ТОРГА ДЛЯ «${position.toUpperCase()}»:

1. Принцип вилки с обоснованием:
«Изучив рынок и специфику задач на данной позиции, я ориентируюсь на уровень от 130 000 до 160 000 рублей на руки (в зависимости от зоны ответственности, системы KPI и бонусной части). При этом для меня первостепенны масштаб задач и перспективы компании, поэтому я готов гибко обсудить структуру общего компенсационного пакета».

2. Если рекрутер настаивает на точной цифре:
Называйте комфортную для вас медиану с фразой: «Базовая планка, от которой я готов стартовать — [ваша сумма] net, при условии прозрачной системы бонусов за выполнение ключевых KPI».

3. Что категорически нельзя говорить:
• «Мне столько нужно, потому что у меня ипотека/кредиты» (работодатель платит за ценность, а не за ваши расходы).
• «Сколько предложите, на столько согласен» (демонстрирует низкую самооценку кандидата).`;
}
