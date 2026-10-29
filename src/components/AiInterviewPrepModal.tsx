"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Check,
  Loader2,
  Copy,
  Target,
  AlertOctagon,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Building2,
  Briefcase,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { callAI } from "@/lib/ai-client";

export interface InterviewQuestionItem {
  id: number;
  question: string;
  whyAsked: string;
  typicalMistake: string;
  idealAnswer: string;
}

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
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
  const [copiedId, setCopiedId] = useState<number | "all" | null>(null);

  // Auto-generate on first open if empty
  useEffect(() => {
    if (open && questions.length === 0 && !isLoading) {
      handleGenerate();
    }
  }, [open]);

  const handleGenerate = async () => {
    setIsLoading(true);

    const systemPrompt = `Ты топ-хэдхантер и нанимающий директор. Твоя задача — составить для кандидата структурированную шпаргалку к собеседованию на позицию «${position}» в компанию «${company}».
Найди 3 САМЫХ КАВЕРЗНЫХ И ОСТРЫХ вопроса, которые задаст нанимающий менеджер или HR именно по этой вакансии и на основе опыта кандидата.
Для КАЖДОГО вопроса обязательно укажи:
1. question: текст самого вопроса
2. whyAsked: что на самом деле проверяет HR (скрытый смысл)
3. typicalMistake: ❌ Типичная ошибка (как нельзя отвечать, фатальные слова)
4. idealAnswer: ✅ Идеальный ответ на 10/10 (прочитайте это на собеседовании) по методике STAR с оцифрованными метриками из опыта кандидата.

Отвечай СТРОГО в формате валидного JSON (без markdown-оберток):
{
  "questions": [
    {
      "id": 1,
      "question": "...",
      "whyAsked": "...",
      "typicalMistake": "...",
      "idealAnswer": "..."
    },
    {
      "id": 2,
      "question": "...",
      "whyAsked": "...",
      "typicalMistake": "...",
      "idealAnswer": "..."
    },
    {
      "id": 3,
      "question": "...",
      "whyAsked": "...",
      "typicalMistake": "...",
      "idealAnswer": "..."
    }
  ]
}`;

    const userPrompt = `КОМПАНИЯ: ${company}
ДОЛЖНОСТЬ: ${position}

ВАКАНСИЯ:
${jobDesc.slice(0, 1600)}

РЕЗЮМЕ КАНДИДАТА:
${resumeText.slice(0, 1600)}

Составь ровно 3 самых каверзных вопроса, типичные ошибки и идеальные ответы на 10/10 в формате JSON.`;

    try {
      const res = await callAI({
        systemPrompt,
        userPrompt,
        temperature: 0.3,
        mode: "interview_prep",
      });

      const parsed = parseQuestionsResponse(res.text, position, company);
      setQuestions(parsed);
    } catch (err) {
      console.warn("Interview prep AI error:", err);
      setQuestions(getFallbackQuestions(position, company));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySingleAnswer = (id: number, answerText: string) => {
    navigator.clipboard.writeText(answerText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const text = `🎯 ШПАРГАЛКА К СОБЕСЕДОВАНИЮ (LaunchPad AI PRO)
Компания: ${company}
Должность: ${position}

${questions
  .map(
    (q, idx) => `=========================================
ВОПРОС #${idx + 1}: ${q.question}
🎯 Что проверяет HR: ${q.whyAsked}

❌ Типичная ошибка (как нельзя отвечать):
${q.typicalMistake}

✅ Идеальный ответ на 10/10 (прочитайте это на собеседовании):
${q.idealAnswer}`
  )
  .join("\n\n")}`;

    navigator.clipboard.writeText(text);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-20px)] sm:max-w-3xl bg-card border-border text-foreground max-h-[92vh] flex flex-col p-4 sm:p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <span>🎯 Подготовка к интервью</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">
                    AI Cheatsheet
                  </span>
                </DialogTitle>
                <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 mt-0.5">
                  <span className="flex items-center gap-1 text-foreground font-medium">
                    <Briefcase className="w-3 h-3 text-purple-400" />
                    {position}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Building2 className="w-3 h-3 text-purple-400" />
                    {company}
                  </span>
                </DialogDescription>
              </div>
            </div>

            {questions.length > 0 && !isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                className="h-8 text-xs border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Обновить</span>
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1 text-xs">
          {isLoading ? (
            <div className="p-10 bg-card/60 border border-border/80 rounded-2xl text-center space-y-4 my-auto">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-foreground">
                  ИИ моделирует собеседование под вакансию...
                </h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Сопоставляем профиль кандидата с требованиями «{company}», выявляем острые углы и генерируем 3 каверзных вопроса с идеальными ответами на 10/10.
                </p>
              </div>
            </div>
          ) : questions.length === 0 ? (
            <div className="p-8 bg-card/60 border border-dashed border-border rounded-2xl text-center space-y-4 my-auto">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-foreground">
                  3 самых каверзных вопроса от HR
                </h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Получите готовую шпаргалку с разбором скрытых ловушек, типичных фатальных ошибок и эталонных ответов на 10/10.
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleGenerate}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-md shadow-primary/25 cursor-pointer px-5 h-9"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Сгенерировать шпаргалку к интервью
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-xs text-purple-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span>
                    Разбор составлен с учетом оцифрованного опыта из резюме для компании <strong>{company}</strong>
                  </span>
                </div>
                <span className="text-[11px] font-mono text-purple-300">
                  3 вопроса
                </span>
              </div>

              {questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-3 transition-all hover:border-purple-500/30"
                >
                  {/* Question Header */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Вопрос #{idx + 1}
                      </span>
                      {q.whyAsked && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 text-purple-400" />
                          <span className="italic">{q.whyAsked}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-foreground leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  {/* ❌ Typicial Mistake Block */}
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 space-y-1">
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
                      <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                      <span>❌ Типичная ошибка (как нельзя отвечать)</span>
                    </div>
                    <p className="text-xs text-rose-200/90 leading-relaxed font-sans pl-5">
                      {q.typicalMistake}
                    </p>
                  </div>

                  {/* ✅ Ideal 10/10 Answer Block */}
                  <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>✅ Идеальный ответ на 10/10 (прочитайте это на собеседовании)</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopySingleAnswer(q.id || idx, q.idealAnswer)}
                        className="h-6 text-[10px] font-semibold border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer flex items-center gap-1 px-2 shrink-0"
                      >
                        {copiedId === (q.id || idx) ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === (q.id || idx) ? "Скопировано!" : "Скопировать ответ"}</span>
                      </Button>
                    </div>
                    <div className="p-2.5 rounded-md bg-background/70 border border-emerald-500/20 text-xs text-emerald-100/95 leading-relaxed font-sans">
                      {q.idealAnswer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer text-muted-foreground"
          >
            Закрыть
          </Button>

          {questions.length > 0 && (
            <Button
              size="sm"
              onClick={handleCopyAll}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5 px-4 h-8"
            >
              {copiedId === "all" ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedId === "all" ? "Вся шпаргалка скопирована!" : "Скопировать всю шпаргалку (3 вопроса)"}</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Parses LLM response into structured 3 questions with robust fallback */
function parseQuestionsResponse(
  rawText: string,
  position: string,
  company: string
): InterviewQuestionItem[] {
  if (!rawText) return getFallbackQuestions(position, company);

  try {
    // 1. Try finding JSON substring
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed.questions.slice(0, 3).map((item: any, idx: number) => ({
          id: item.id || idx + 1,
          question: item.question || `Вопрос от нанимающего руководителя #${idx + 1}`,
          whyAsked: item.whyAsked || "Проверка практического опыта и соответствия вакансии",
          typicalMistake: item.typicalMistake || "Размытые ответы без конкретных цифр и фактов.",
          idealAnswer: item.idealAnswer || "Четкий ответ по методике STAR с опорой на оцифрованные метрики.",
        }));
      }
    }
  } catch (err) {
    console.warn("JSON parse failed for interview prep, extracting text blocks:", err);
  }

  // 2. Fallback: Parse structured text if LLM didn't return strict JSON
  const questionBlocks = rawText.split(/(?:ВОПРОС\s*#?\d|Вопрос\s*#?\d)/i).filter((b) => b.trim().length > 20);
  if (questionBlocks.length >= 2) {
    return questionBlocks.slice(0, 3).map((block, idx) => {
      const qMatch = block.match(/^(?:[:\-–\s]+)?([^\n]+)/);
      const question = qMatch ? qMatch[1].replace(/[«»"]/g, "").trim() : `Вопрос #${idx + 1}`;

      const mistakeMatch = block.match(/(?:типичная ошибка|как нельзя|ошибка)[:\s]+([\s\S]*?)(?=(?:идеальный ответ|ответ на 10|решение|$))/i);
      const typicalMistake = mistakeMatch
        ? mistakeMatch[1].trim()
        : "Оправдания, отсутствие конкретики и обвинение коллег или прошлых работодателей.";

      const answerMatch = block.match(/(?:идеальный ответ|ответ на 10|как отвечать)[:\s]+([\s\S]*)/i);
      const idealAnswer = answerMatch
        ? answerMatch[1].trim()
        : "«На предыдущем проекте я решил аналогичную задачу: сократил время выполнения регламентов на 30% и обеспечил 100% выполнение целевых показателей без сбоев».";

      return {
        id: idx + 1,
        question: `«${question}»`,
        whyAsked: "Проверка глубины профессиональных компетенций и стрессоустойчивости",
        typicalMistake,
        idealAnswer,
      };
    });
  }

  return getFallbackQuestions(position, company);
}

/** Tailored fallback questions for candidate's profession */
function getFallbackQuestions(position: string, company: string): InterviewQuestionItem[] {
  const p = (position || "").toLowerCase();

  if (p.includes("бухгалтер") || p.includes("финанс") || p.includes("аудит")) {
    return [
      {
        id: 1,
        question: `«В нашем бизнесе регулярно возникают нестандартные хозяйственные операции и повышенное внимание со стороны налоговых органов. Как вы защищаете позицию компании при выездных или камеральных проверках?»`,
        whyAsked: "HR и финансовый директор проверяют хладнокровие, знание актуальной нормативной базы и готовность отстаивать интересы бизнеса, а не просто соглашаться на штрафы.",
        typicalMistake: "«Я сразу привлекаю внешних аудиторов/юристов» или «Если налоговая требует доначислить, лучше заплатить, чтобы не было проблем».",
        idealAnswer: `«Мой алгоритм — превентивная проверка документации и подготовка правовой аргументации до подачи отчетности. На предыдущем месте при камеральной проверке я сформировал детализированные регистры и пояснительную записку со ссылками на разъяснения Минфина, что позволило закрыть вопрос без единого рубля доначислений и штрафов».`
      },
      {
        id: 2,
        question: `«Случалось ли в вашей практике обнаружить грубые ошибки или недостачу в учете от предыдущего бухгалтера? Как вы это урегулировали?»`,
        whyAsked: "Проверка на конфликтность и системность: начнет ли кандидат поливать грязью предшественника или спокойно восстановит учет.",
        typicalMistake: "«Предыдущий бухгалтер был абсолютно некомпетентен, там был полный хаос, я всем об этом рассказал».",
        idealAnswer: `«Вместо критики предшественника я провел экспресс-аудит сальдо и первичных документов, составил реестр расхождений и согласовал с руководством график корректировок. В течение 3 недель были поданы уточненные декларации, что снизило пени на 40% и полностью восстановило прозрачность учета».`
      },
      {
        id: 3,
        question: `«Почему вы хотите работать именно в ${company} и что для вас станет главным показателем успешного прохождения испытательного срока?»`,
        whyAsked: "Детектор мотивации: ищет ли бухгалтер тихое место пересидеть кризис или готов взять ответственность за порядок в финансах.",
        typicalMistake: "«У вас офис близко к дому и хорошая зарплата» или размытое «хочу стабильности».",
        idealAnswer: `«В ${company} меня привлекает масштабирование бизнеса и интересные задачи по автоматизации учета. Главным критерием успеха через 3 месяца я считаю: закрытие отчетного периода без задержек день в день, 0 претензий от контролирующих органов и экономию времени руководства на подписание финансовой отчетности».`
      }
    ];
  }

  if (p.includes("продаж") || p.includes("коммерческ") || p.includes("b2b") || p.includes("rop") || p.includes("роп")) {
    return [
      {
        id: 1,
        question: `«Наш продукт стоит на 20–30% дороже аналогов на рынке. Клиент говорит: „У ваших конкурентов то же самое, но дешевле“. Каков ваш точный ответ?»`,
        whyAsked: "Проверка навыка отработки ключевого возражения по цене и умения продавать через ценность, а не сливать маржу скидками.",
        typicalMistake: "«Мы можем согласовать для вас индивидуальную скидку» или агрессивное «У конкурентов дешевле, потому что у них качество плохое».",
        idealAnswer: `«Я соглашаюсь с клиентом, что цена — важный фактор, но перевожу фокус на совокупную стоимость владения (TCO): „Иван Иванович, первоначальная цена действительно отличается. Но за счет отсутствия скрытых расходов на доработки и гарантии бесперебойной работы на 12 месяцев наши клиенты экономят до 25% бюджета уже в первом полугодии. Давайте разберем спецификацию в цифрах?“ На прошлом месте это позволило закрывать 8 из 10 сделок по верхней планке прайса».`
      },
      {
        id: 2,
        question: `«Расскажите о самой крупной сорвавшейся сделке в вашей практике. В чем была причина и какие выводы вы сделали?»`,
        whyAsked: "Проверка честности, способности признавать ошибки и обучаться на факапах без самооправданий.",
        typicalMistake: "«У меня не было сорвавшихся сделок» или «Клиент оказался неадекватным / руководство долго согласовывало договор».",
        idealAnswer: `«На сделке с чеком 4.5 млн руб. я слишком долго общался с контактным лицом, не выйдя вовремя на реального ЛПР (финдиректора). В итоге проект отложили. Я сделал системный вывод: разработал регламент квалификации стейкхолдеров на втором касании. Это помогло уже в следующем квартале закрыть контракт на 7 млн руб. без затягивания сроков».`
      },
      {
        id: 3,
        question: `«Какие цифры в воронке продаж вы покажете в ${company} через первые 60 дней?»`,
        whyAsked: "Оценка реалистичности планов и понимания математики воронки продаж.",
        typicalMistake: "«Я сразу удвою ваши продажи» (пустые обещания) или «Все зависит от того, какой трафик мне даст маркетинг».",
        idealAnswer: `«За первые 2 недели я детально изучу скрипты, УТП и базу отказников. К концу первого месяца выйду на плановый объем активности (от 30 целевых диалогов в день), а к концу второго месяца — на закрытие первых 3–5 сделок по среднему чеку, конвертируя лидов из пайплайна с точностью не менее 22%».`
      }
    ];
  }

  // Universal High-Impact Default
  return [
    {
      id: 1,
      question: `«В вашем резюме упомянут солидный опыт, однако в нашей компании на позиции «${position}» требования к точности и темп работы выше средних по рынку. С какими сложностями вы столкнетесь в первые 2 месяца?»`,
      whyAsked: "HR и нанимающий директор проверяют зрелость, стрессоустойчивость и трезвую самооценку без иллюзий.",
      typicalMistake: "«У меня вообще не будет трудностей, я легко со всем справлюсь» (звучит легкомысленно) или защитная критика: «У вас что, постоянные переработки?».",
      idealAnswer: `«Основной фокус первых 2–3 недель — глубоко погрузиться во внутренние регламенты ${company} и стек задач подразделения. На предыдущих проектах я уже проходил адаптацию в сжатые сроки: структурировал процессы по чек-листам и сокращал срок выполнения рутины на 30%. Первые плановые результаты готов выдавать со второй недели без отвлечения коллег».`
    },
    {
      id: 2,
      question: `«Расскажите о реальном случае, когда проект или задача оказались под угрозой срыва по вине смежного отдела или подрядчика. Каковы были ваши действия?»`,
      whyAsked: "Проверка кросс-функциональной дипломатии, лидерских качеств и умения находить решение вместо поиска крайних.",
      typicalMistake: "Перекладывание вины на других: «Они постоянно срывают дедлайны, я просто написал служебку руководству и снял с себя ответственность».",
      idealAnswer: `«Вместо взаимных обвинений я оперативно вышел на руководителя смежного направления, мы разложили критический путь задачи и перераспределили часть операций. Дедлайн был удержан без потерь для бизнеса, а по итогам инцидента мы внедрили единый шаблон передачи данных, исключив повторение проблемы на 100%».`
    },
    {
      id: 3,
      question: `«Почему вы решили рассматривать предложения и что именно в задачах в ${company} должно произойти через полгода, чтобы вы посчитали свой переход успехом?»`,
      whyAsked: "Детектор токсичности и истинной мотивации: бежит ли соискатель от проблем или осознанно стремится к профессиональному росту.",
      typicalMistake: "Жалобы на предыдущее руководство («мало платили, ставили глупые задачи») или размытый ответ: «Просто хочу карьерного роста и больше денег».",
      idealAnswer: `«На прошлом месте я полностью решил поставленные задачи: оптимизировал процессы и выстроил стабильную систему. В ${company} меня привлекает масштаб стоящих задач. Успехом через 6 месяцев я буду считать 100% прохождение испытательного срока с перевыполнением KPI и внедрение практик, сэкономивших подразделению рабочее время».`
    }
  ];
}
