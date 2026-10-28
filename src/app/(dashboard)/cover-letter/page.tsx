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

const SAMPLE_GENERATED_LETTER = `Здравствуйте, команда найма Яндекс!

Пишу, чтобы выразить искреннюю заинтересованность в позиции Senior Product Manager в направлении Cloud AI. Внимательно слежу за развитием инфраструктурных сервисов Яндекса и хочу применить свой практический опыт масштабирования технологических B2B-продуктов в вашей команде.

За последние 6 лет в CloudScale Solutions и FinTech Инновациях я руководил продуктовыми командами разработки до 12 инженеров. Моим ключевым достижением стал запуск аналитического AI-модуля, который сократил время получения ценности клиентами с трёх недель до 4 часов, а внедрение регулярного A/B-тестирования подняло конверсию в повторные заказы на 24%. Я глубоко понимаю баланс между технической архитектурой, продуктовыми метриками и ожиданиями стейкхолдеров.

Культура инженерного превосходства и масштабы задач Яндекса полностью соответствуют моим профессиональным ценностям. Буду рад встретиться на онлайн-интервью и подробнее обсудить, как мои навыки помогут вашей команде достигать ключевых целей в этом квартале.

С уважением,
Алексей Морозов
alex.morozov@email.ru | +7 (999) 123-45-67`;

export default function CoverLetterPage() {
  const [company, setCompany] = useState("Яндекс");
  const [role, setRole] = useState("Senior Product Manager");
  const [tone, setTone] = useState("professional");
  const [keyAchievement, setKeyAchievement] = useState(
    "Руководил командой из 12 инженеров, поднял конверсию на 24% за счёт A/B-тестирования, ускорил онбординг клиентов с 3 недель до 4 часов."
  );
  const [letterContent, setLetterContent] = useState(SAMPLE_GENERATED_LETTER);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setLetterContent(
        `Здравствуйте, команда ${company}!\n\nМеня очень заинтересовала вакансия ${role} в вашей компании. Обладая 6-летним опытом руководства продуктовыми командами и сильным бэкграундом в IT, я уверен, что смогу усилить ваши процессы с первых дней.\n\nВ частности, ${keyAchievement} Мой подход строится на строгой data-driven аналитике, глубоких качественных исследованиях пользователей и слаженном взаимодействии с инженерной командой.\n\nБуду рад обсудить подробности на техническом интервью.\n\nС уважением,\nАлексей Морозов\n+7 (999) 123-45-67`
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
    const file = new Blob([letterContent], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${company}_Сопроводительное_письмо_${role.replace(/\s+/g, "_")}.txt`;
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
          <span>Генератор сопроводительных писем (Cover Letter AI)</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Создавайте персонализированные, живые сопроводительные письма за 10 секунд. С учётом культуры компании, тональности и ваших сильных сторон.
        </p>
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
                Укажите данные для генерации письма с помощью нейросети
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div>
                <Label htmlFor="company-name" className="text-xs">Название компании</Label>
                <Input
                  id="company-name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Например: Яндекс, Т-Банк, Авито, Ozon"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="role-name" className="text-xs">Целевая должность</Label>
                <Input
                  id="role-name"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Например: Senior Product Manager"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="tone-select" className="text-xs">Тональность письма</Label>
                <Select value={tone} onValueChange={(val) => val && setTone(val)}>
                  <SelectTrigger id="tone-select" className="mt-1 text-xs">
                    <SelectValue placeholder="Выберите стиль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">👔 Профессиональный и сбалансированный</SelectItem>
                    <SelectItem value="bold">🚀 Уверенный и результативный</SelectItem>
                    <SelectItem value="concise">⚡ Краткий и ёмкий (3 абзаца)</SelectItem>
                    <SelectItem value="startup">💡 Энергичный для стартапа</SelectItem>
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
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-md shadow-primary/20 h-10"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Нейросеть составляет письмо...
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
                  Доступно для редактирования • {letterContent.split(/\s+/).filter(Boolean).length} слов • ~1 мин чтения
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
                  className="h-8 text-xs font-medium"
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
                onChange={(e) => setLetterContent(e.target.value)}
                className="font-mono text-xs leading-relaxed bg-background/50 border-border p-4 rounded-xl resize-y"
              />

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                <span className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    Готово к отправке
                  </Badge>
                  <span>Формат: чистый текст без таблиц для 100% совместимости с ATS</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLetterContent(SAMPLE_GENERATED_LETTER)}
                  className="h-7 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-3 h-3 mr-1" /> Сбросить
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
