"use client";

import { useState, useEffect } from "react";
import {
  PenTool,
  Sparkles,
  Copy,
  Check,
  Download,
  FileText,
  RotateCcw,
  Sliders,
  Globe,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cleanAIMarkdownArtifacts } from "@/lib/monetization";
import { detectLanguage } from "@/lib/language";
import { callAI } from "@/lib/ai-client";
import { useApp } from "@/context/AppContext";

export default function CoverLetterPage() {
  const {
    userProfile,
    coverLetterTargetJob,
    showToast,
    isPro,
    remainingScans,
    consumeScan,
    setIsUpgradeModalOpen,
    setUpgradeReason,
  } = useApp();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "concise">("professional");
  const [keyAchievement, setKeyAchievement] = useState("");
  const [letterContent, setLetterContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<0 | 1 | 2>(0);
  const [copied, setCopied] = useState(false);

  // Pre-fill target job if routed from Kanban tracker or Scanner
  useEffect(() => {
    if (coverLetterTargetJob) {
      if (coverLetterTargetJob.company) setCompany(coverLetterTargetJob.company);
      if (coverLetterTargetJob.position) setRole(coverLetterTargetJob.position);
      showToast(`Подставлены данные вакансии «${coverLetterTargetJob.company}»`);
    }
  }, [coverLetterTargetJob, showToast]);

  const handleGenerate = async () => {
    if (!isPro && remainingScans <= 0) {
      setUpgradeReason("Бесплатные попытки закончились (0/2). Оформите PRO для безлимитной генерации сопроводительных писем!");
      setIsUpgradeModalOpen(true);
      return;
    }

    const effectiveCompany = company.trim() || "Компания мечты";
    const effectiveRole = role.trim() || "Профильный специалист";

    setIsGenerating(true);
    setGenerationPhase(1);

    // Switch to step 2 after a brief analysis phase
    const phaseTimer = setTimeout(() => {
      setGenerationPhase(2);
    }, 1300);

    const lang = detectLanguage(`${company} ${role} ${keyAchievement}`);

    try {
      const toneRu =
        tone === "enthusiastic"
          ? "энергичный, вдохновляющий и открытый"
          : tone === "concise"
          ? "краткий, лаконичный и строго по делу (до 150 слов)"
          : "профессиональный, уверенный и убедительный";

      const achievementInstruction = keyAchievement.trim()
        ? keyAchievement.trim()
        : `Кандидат не указал конкретное достижение вручную. Твоя задача: самостоятельно сформулировать 1 мощный, реалистичный оцифрованный результат с измеримой метрикой (%, рубли, объемы, сроки, количество), СТРОГО специфичный для профессии "${effectiveRole}".
Примеры специфики:
- Для Учителя / Преподавателя: средний балл ЕГЭ учеников 84+, призеры региональных олимпиад, разработка интерактивного методического курса.
- Для Инженера / Проектировщика: успешный выпуск проектной документации в AutoCAD/BIM, прохождение экспертизы без замечаний, оптимизация сметных затрат на 15%.
- Для Бухгалтера: успешное закрытие 4 камеральных проверок ФНС без штрафов, ускорение закрытия периода на 35%, сквозной учет ОСНО.
- Для Менеджера по продажам: перевыполнение квартального плана на 28%, средний чек сделок от 1.5 млн руб.
- Для Маркетолога: снижение CPL/CAC на 30% при росте конверсии сайта с 1.8% до 3.6%.
КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО упоминать ИТ-инженеров, разработку кода или нерелевантные технологии, если роль соискателя не относится к IT!`;

      const systemPrompt = `You are a world-class executive career strategist and ghostwriter.
Your task is to craft an authentic, high-converting cover letter for the candidate applying for the target position.

STRICT RULES:
1. Output plain human text only. NEVER use Markdown asterisks (**), hashtags (#), or code fences.
2. Tone: ${toneRu}.
3. Structure: 3 concise, impactful paragraphs:
   - Paragraph 1: Direct, non-cliché opening hook expressing enthusiasm for ${effectiveCompany} and the ${effectiveRole} role.
   - Paragraph 2: Core quantified achievement proving tangible business/operational value for ${effectiveRole}: ${achievementInstruction}
   - Paragraph 3: Clear call to action proposing a 15-minute introductory call, professional sign-off.
4. Sign with the candidate's real profile:
   ${userProfile.name}
   ${userProfile.email} | ${userProfile.phone}`;

      const userPrompt = `КОМПАНИЯ: ${effectiveCompany}
ДОЛЖНОСТЬ: ${effectiveRole}
ДОСТИЖЕНИЕ: ${achievementInstruction}
ЯЗЫК: ${lang === "en" ? "English" : "Russian"}
ФИО СОИСКАТЕЛЯ: ${userProfile.name}
КОНТАКТЫ: ${userProfile.email} | ${userProfile.phone}

Напиши сильное, живое и убедительное сопроводительное письмо без шаблонных штампов («Я идеальный кандидат», «Прошу рассмотреть мою кандидатуру»). Сохраняй точное ФИО и контакты автора!`;

      const res = await callAI({
        systemPrompt,
        userPrompt,
        temperature: 0.35,
        mode: "cover_letter",
      });

      if (res.text && res.text.trim().length > 30) {
        setLetterContent(cleanAIMarkdownArtifacts(res.text.trim()));
        if (!isPro) {
          consumeScan();
        }
        showToast("✨ Сопроводительное письмо сгенерировано нейросетью под вашу роль!");
      } else {
        // Deterministic fallback tailored strictly to role
        const fallbackText = `Здравствуйте, команда ${effectiveCompany}!

С большим интересом откликаюсь на открытую позицию «${effectiveRole}». Внимательно ознакомился с ключевыми задачами направления и вижу глубокое соответствие между потребностями вашей команды и моим практическим бэкграундом.

На протяжении всей карьеры я ориентируюсь на оцифрованный результат и системность. На предыдущих проектах мне удалось оптимизировать ключевые рабочие процессы на 30%+, сократить временные издержки подразделения и обеспечить 100% выполнение целевых показателей в роли «${effectiveRole}». Отлично понимаю специфику вашей отрасли и готов сразу включиться в текущие задачи без долгой раскачки.

Уверен, что мой практический опыт, внимание к качеству и высокий уровень ответственности позволят ${effectiveCompany} ускорить достижение поставленных бизнес-целей. Буду рад встретиться на онлайн-интервью в удобное для вас время.

С уважением,
${userProfile.name}
Телефон: ${userProfile.phone} | Email: ${userProfile.email}`;
        setLetterContent(cleanAIMarkdownArtifacts(fallbackText));
        showToast("✨ Сопроводительное письмо сформировано!");
      }
    } catch (err) {
      console.error(err);
      showToast("Ошибка при связи с сервером генерации");
    } finally {
      clearTimeout(phaseTimer);
      setIsGenerating(false);
      setGenerationPhase(0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanAIMarkdownArtifacts(letterContent));
    setCopied(true);
    showToast("Скопировано в буфер обмена!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const cleanedText = cleanAIMarkdownArtifacts(letterContent);
    const element = document.createElement("a");
    const file = new Blob([cleanedText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    const fileCompany = company.trim() || "Компания";
    const fileRole = role.trim() || "Вакансия";
    element.download = `${fileCompany}_Сопроводительное_письмо_${fileRole.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast("Файл .txt успешно скачан!");
  };

  const detectedLang = detectLanguage(`${company} ${role} ${keyAchievement}`);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <PenTool className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
            <span>Генератор сопроводительных писем</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Создавайте персонализированные, живые сопроводительные письма за 10 секунд без шаблонов и артефактов.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs text-primary border-primary/30 bg-primary/10 flex items-center gap-1.5 py-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Язык: {detectedLang === "en" ? "English" : "Русский"}</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-card/70 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <span>Параметры вакансии</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Подпись автора автоматически подтягивается из профиля: <span className="font-semibold text-foreground">{userProfile.name}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div>
                <Label htmlFor="company-name" className="text-xs font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <span>Название компании</span>
                </Label>
                <Input
                  id="company-name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Например: Яндекс, Т-Банк, Самокат, Ozon"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="role-name" className="text-xs font-semibold flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span>Целевая должность</span>
                </Label>
                <Input
                  id="role-name"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Например: Главный бухгалтер, Учитель, Инженер ПТО"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="tone-select" className="text-xs font-semibold">Тональность письма</Label>
                <Select value={tone} onValueChange={(val) => val && setTone(val as any)}>
                  <SelectTrigger id="tone-select" className="mt-1 text-xs">
                    <SelectValue placeholder="Выберите стиль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">👔 Профессиональный и сбалансированный</SelectItem>
                    <SelectItem value="enthusiastic">🚀 Уверенный и результативный</SelectItem>
                    <SelectItem value="concise">⚡ Краткий и ёмкий (3 абзаца)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="achievement" className="text-xs font-semibold">
                    Ключевое достижение
                  </Label>
                  <span className="text-[10px] text-muted-foreground">Необязательно</span>
                </div>
                <Textarea
                  id="achievement"
                  rows={4}
                  value={keyAchievement}
                  onChange={(e) => setKeyAchievement(e.target.value)}
                  placeholder="Например: Оптимизировал процессы на 30%, снизил расходы на 1.2 млн ₽. (Если оставить пустым — ИИ сам синтезирует оцифрованное достижение строго под вашу целевую роль)"
                  className="mt-1 text-xs resize-y placeholder:text-muted-foreground/60"
                />
                <span className="text-[10px] text-muted-foreground/80 mt-1 block">
                  💡 При пустом поле ИИ сгенерирует метрики строго по профилю вакансии без шаблонных штампов.
                </span>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-md shadow-primary/20 h-10 cursor-pointer flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Составляем персонализированное письмо...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Сгенерировать письмо</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Output Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-card/70 border-border min-h-[460px] flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-border/70 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Сопроводительное письмо</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {letterContent
                    ? `Готово к отправке • ${letterContent.split(/\s+/).filter(Boolean).length} слов • Автор: ${userProfile.name}`
                    : "Ожидание параметров для генерации"}
                </CardDescription>
              </div>

              {letterContent && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 text-xs font-medium cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        Скопировано
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        Копировать
                      </>
                    )}
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleDownload}
                    className="h-8 text-xs font-medium cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Скачать .TXT
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
              {isGenerating ? (
                /* Two-Stage Progress Loading State */
                <div className="py-12 sm:py-16 px-4 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
                    <Loader2 className="w-7 h-7 text-primary animate-spin" />
                  </div>

                  <div className="space-y-1.5 max-w-md">
                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      Создание адресного сопроводительного письма
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      ИИ формулирует убедительные аргументы и оцифровывает результаты без штампов
                    </p>
                  </div>

                  {/* Visual 2-Step Checklist */}
                  <div className="w-full max-w-sm space-y-2.5 text-left text-xs bg-background/60 p-4 rounded-xl border border-border">
                    <div className="flex items-center gap-2.5">
                      {generationPhase >= 2 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                      )}
                      <span className={generationPhase >= 2 ? "text-emerald-300 font-medium" : "text-foreground font-semibold"}>
                        Шаг 1: Анализ компании и требований к вакансии...
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {generationPhase >= 2 ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-muted-foreground/30 shrink-0" />
                      )}
                      <span className={generationPhase >= 2 ? "text-foreground font-semibold" : "text-muted-foreground"}>
                        Шаг 2: Составление письма и оцифровка достижений...
                      </span>
                    </div>
                  </div>
                </div>
              ) : letterContent ? (
                /* Ready Generated Letter Area */
                <div className="space-y-4">
                  <Textarea
                    rows={16}
                    value={letterContent}
                    onChange={(e) => setLetterContent(cleanAIMarkdownArtifacts(e.target.value))}
                    className="font-mono text-xs leading-relaxed bg-background/50 border-border p-4 rounded-xl resize-y"
                  />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground border-t border-border/40 pt-3">
                    <span className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        Готово к отправке
                      </Badge>
                      <span>Чистый текст без нейрозвёздочек и решёток</span>
                    </span>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerate}
                      className="h-7 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" /> Переписать
                    </Button>
                  </div>
                </div>
              ) : (
                /* Initial Empty Waiting State */
                <div className="py-16 sm:py-20 px-4 flex flex-col items-center justify-center text-center space-y-3.5 my-auto">
                  <div className="w-14 h-14 rounded-2xl bg-muted/40 border border-border flex items-center justify-center text-muted-foreground">
                    <PenTool className="w-7 h-7 opacity-60" />
                  </div>

                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-sm font-bold text-foreground">
                      Письмо пока не сгенерировано
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Укажите компанию и целевую должность в параметрах слева, затем нажмите кнопку «Сгенерировать письмо».
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-[11px] text-muted-foreground/80 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Без штампов • Оцифрованные метрики по формуле Google</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
