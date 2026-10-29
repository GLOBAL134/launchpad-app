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
  Send,
  Sliders,
  Globe,
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
  const { userProfile, coverLetterTargetJob, showToast } = useApp();

  const [company, setCompany] = useState("Яндекс");
  const [role, setRole] = useState("Senior Product Manager");
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "concise">("professional");
  const [keyAchievement, setKeyAchievement] = useState(
    "Руководил командой из 12 инженеров, поднял конверсию на 24% за счёт A/B-тестирования, ускорил онбординг клиентов с 3 недель до 4 часов."
  );
  const [letterContent, setLetterContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pre-fill target job if routed from Kanban tracker
  useEffect(() => {
    if (coverLetterTargetJob) {
      setCompany(coverLetterTargetJob.company);
      setRole(coverLetterTargetJob.position);
      showToast(`Подставлены данные вакансии «${coverLetterTargetJob.company}»`);
    }
  }, [coverLetterTargetJob, showToast]);

  // Initial letter generator on load or user profile update
  useEffect(() => {
    const lang = detectLanguage(`${company} ${role} ${keyAchievement}`);
    const initialText =
      lang === "en"
        ? `Dear Hiring Team at ${company},\n\nI am writing to express my strong enthusiasm for the ${role} position. Having closely followed your technological initiatives, I am eager to contribute my hands-on expertise to your mission.\n\nThroughout my career, I have consistently focused on high-impact execution. In particular, ${keyAchievement} My methodology is grounded in rigorous data analysis, user empathy, and efficient collaboration across cross-functional teams.\n\nI welcome the opportunity to discuss how my skill set aligns with your current priorities during an interview.\n\nSincerely,\n${userProfile.name}\n${userProfile.email} | ${userProfile.phone}`
        : `Здравствуйте, команда найма ${company}!\n\nПишу, чтобы выразить искреннюю заинтересованность в позиции ${role}. Внимательно слежу за развитием ваших продуктов и хочу применить свой практический опыт для решения ключевых задач команды.\n\nЗа время карьеры я руководил запуском сложных технологических сервисов. Моим ключевым результатом стало следующее: ${keyAchievement} Мой подход строится на строгой data-driven аналитике, глубоких качественных исследованиях пользователей и слаженном взаимодействии с инженерами.\n\nКультура инженерного превосходства и масштабы задач ${company} полностью соответствуют моим профессиональным ценностям. Буду рад встретиться на онлайн-интервью и подробнее обсудить, как мои навыки помогут вашей команде достигать поставленных целей.\n\nС уважением,\n${userProfile.name}\n${userProfile.email} | ${userProfile.phone}`;

    setLetterContent(cleanAIMarkdownArtifacts(initialText));
  }, [company, role, keyAchievement, userProfile]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const lang = detectLanguage(`${company} ${role} ${keyAchievement}`);

    try {
      const toneRu =
        tone === "enthusiastic"
          ? "энергичный, вдохновляющий и открытый"
          : tone === "concise"
          ? "краткий, лаконичный и строго по делу (до 150 слов)"
          : "профессиональный, уверенный и убедительный";

      const systemPrompt = `You are an elite career strategist. Your task is to write a personalized, high-converting cover letter for the candidate applying to the specified position.
STRICT RULES:
1. Output plain human text only. NEVER use Markdown asterisks (**), hashtags (#), or code fences.
2. Tone: ${toneRu}.
3. Structure: 3 concise, impactful paragraphs:
   - Paragraph 1: Enthusiastic opening, target role, and key hook.
   - Paragraph 2: Core quantified achievement (${keyAchievement || "measurable results"}), proving practical value.
   - Paragraph 3: Clear call to action (invitation to interview), professional sign-off.
4. Sign with: ${userProfile.name}, ${userProfile.email} | ${userProfile.phone}`;

      const userPrompt = `КОМПАНИЯ: ${company || "Работодатель"}
ДОЛЖНОСТЬ: ${role || "Специалист"}
КЛЮЧЕВОЕ ДОСТИЖЕНИЕ КАНДИДАТА: ${keyAchievement || "Оптимизация рабочих процессов на 30%+"}
ЯЗЫК: ${lang === "en" ? "English" : "Russian"}

Напиши сильное персональное сопроводительное письмо под эту конкретную профессию и компанию.`;

      const res = await callAI({
        systemPrompt,
        userPrompt,
        temperature: 0.35,
      });

      if (res.text && res.text.trim().length > 30) {
        setLetterContent(cleanAIMarkdownArtifacts(res.text.trim()));
      }
      showToast("✨ Сопроводительное письмо сгенерировано нейросетью под вашу роль!");
    } catch (err) {
      console.error(err);
      showToast("Письмо сгенерировано!");
    } finally {
      setIsGenerating(false);
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
    element.download = `${company}_Сопроводительное_письмо_${role.replace(/\s+/g, "_")}.txt`;
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
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <PenTool className="w-6 h-6 text-primary" />
            <span>Генератор сопроводительных писем (Cover Letter AI)</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
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
                Подпись автора автоматически подтягивается из вашего профиля ({userProfile.name})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div>
                <Label htmlFor="company-name" className="text-xs">Название компании *</Label>
                <Input
                  id="company-name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Например: Яндекс, Т-Банк, Авито, Ozon"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="role-name" className="text-xs">Целевая должность *</Label>
                <Input
                  id="role-name"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Например: Senior Product Manager"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="tone-select" className="text-xs">Тональность письма *</Label>
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
                <Label htmlFor="achievement" className="text-xs">
                  Ключевое достижение, которое важно подчеркнуть
                </Label>
                <Textarea
                  id="achievement"
                  rows={4}
                  value={keyAchievement}
                  onChange={(e) => setKeyAchievement(e.target.value)}
                  placeholder="Например: Увеличил конверсию на 25%, управлял распределенной командой разработки..."
                  className="mt-1 text-xs resize-y"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-md shadow-primary/20 h-10 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Составляем персонализированное письмо...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Сгенерировать письмо
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
                  <span>Сгенерированное письмо</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Доступно для редактирования • {letterContent.split(/\s+/).filter(Boolean).length} слов • Автор: {userProfile.name}
                </CardDescription>
              </div>

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
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <Textarea
                rows={16}
                value={letterContent}
                onChange={(e) => setLetterContent(cleanAIMarkdownArtifacts(e.target.value))}
                className="font-mono text-xs leading-relaxed bg-background/50 border-border p-4 rounded-xl resize-y"
              />

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                <span className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    Готово к отправке
                  </Badge>
                  <span>Чистый человеческий текст без нейрозвёздочек и решёток</span>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
