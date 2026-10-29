"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  ScanSearch,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  FileText,
  AlertCircle,
  Upload,
  FileCheck,
  X,
  CreditCard,
  Lock,
  Send,
  Plus,
  Briefcase,
  Award,
  Layers,
  Code2,
  Terminal,
  Wand2,
  Eye,
  Sliders,
  TrendingUp,
  Kanban,
  FileCheck2,
  Download,
  Link2,
  ExternalLink,
  Globe,
  Printer,
  Target,
  HelpCircle,
  Loader2,
  FileDown,
  Gift,
  Flag,
  DollarSign,
  KeyRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UpgradeProModal from "@/components/UpgradeProModal";
import AtsScoreCardModal from "@/components/AtsScoreCardModal";
import AtsCleanResumeModal from "@/components/AtsCleanResumeModal";
import AiEmbedSkillModal from "@/components/AiEmbedSkillModal";
import AiRewriteResumeModal from "@/components/AiRewriteResumeModal";
import AiSettingsModal from "@/components/AiSettingsModal";
import SaveToKanbanModal from "@/components/SaveToKanbanModal";
import { AiBuildResumeModal } from "@/components/AiBuildResumeModal";
import { HhCopyModal } from "@/components/HhCopyModal";
import { AiInterviewPrepModal } from "@/components/AiInterviewPrepModal";
import { JobRedFlagsCard } from "@/components/JobRedFlagsCard";
import { SalaryNegotiatorModal } from "@/components/SalaryNegotiatorModal";
import { BatchJobComparator } from "@/components/BatchJobComparator";
import { ViralBonusModal } from "@/components/ViralBonusModal";
import { exportResumeToDocx, exportResumeToPdf } from "@/lib/export-resume";
import { cleanAIMarkdownArtifacts } from "@/lib/monetization";
import { detectLanguage } from "@/lib/language";
import { simulateAtsParser, AtsSimulationResult, XyzImprovement } from "@/lib/ats-parser-simulator";
import { useApp } from "@/context/AppContext";

export const DIVERSE_PRESETS = [
  {
    id: "accountant",
    label: "💼 Бухгалтер (ОСНО, 1С, НДС)",
    categoryName: "Финансы и Бухгалтерия",
    job: `Главный бухгалтер (ОСНО, оптовая торговля и услуги)
Компания: ГК «Ресурс-Финанс»
Локация: Москва / Удаленно

Обязанности и требования:
• Ведение бухгалтерского и налогового учета в полном объеме по ОСНО и УСН в 1С:Бухгалтерия 8.3.
• Расчет НДС, налога на прибыль, формирование книг покупок и продаж, сдача отчетности в ФНС и СФР.
• Контроль первичной документации, актов, накладных и счетов-фактур через ЭДО (Диадок / СБИС).
• Успешный опыт прохождения выездных и камеральных налоговых проверок, взаимодействие с банками и ВЭД.`,
    resume: `Анна Смирнова
Главный бухгалтер | +7 (999) 111-22-33 | anna.smirnova@email.ru | Москва

О СЕБЕ
Главный бухгалтер с практическим опытом 6+ лет в ведении бухгалтерского и налогового учета (ОСНО, УСН). Эксперт в 1С:Бухгалтерия 8.3, расчете НДС и налога на прибыль. Успешно сопроводила 4 камеральные проверки ФНС без штрафных санкций.

ОПЫТ РАБОТЫ
Главный бухгалтер — ГК «ТоргСнаб» (2021 — настоящее время)
• Руководила ведением бухгалтерского и налогового учета по ОСНО и УСН (годовой оборот свыше 420 млн руб.).
• Настроила сквозной учет НДС и контроль книг покупок/продаж в 1С:Бухгалтерия 8.3, предотвратив налоговые разрывы на 6.8 млн руб.
• Автоматизировала первичную документацию через ЭДО (Диадок / СБИС), сократив время закрытия месяца с 10 до 4 дней.
• Успешно защитила позицию компании в 4 выездных и камеральных налоговых проверках ФНС без штрафов.

Ведущий бухгалтер — СервисФинанс (2018 — 2021)
• Обеспечивала безошибочный расчет заработной платы и налогов на штат 190+ сотрудников в 1С:ЗУП.
• Контролировала банковские выписки и реестры платежей в системе Банк-Клиент.

КЛЮЧЕВЫЕ НАВЫКИ
1С:Бухгалтерия 8.3, 1С:ЗУП, ОСНО, УСН, НДС, Налог на прибыль, Первичная документация, ЭДО (Диадок, СБИС), Банк-Клиент, Сдача отчетности в ФНС, СФР, Налоговый аудит.`,
  },
  {
    id: "sales",
    label: "📈 Менеджер / РОП (B2B, CRM)",
    categoryName: "Продажи и Коммерция",
    job: `Руководитель отдела продаж (B2B сегмент)
Компания: Смарт Дистрибьюшн
Локация: Москва / Удаленно

Требования:
• 5+ лет в коммерческих B2B-продажах, подтвержденный трек перевыполнения плана KPI.
• Внедрение регламентов и автоматизации в AmoCRM и Bitrix24, управление воронкой продаж.
• Проведение сложных переговоров с первыми лицами компаний (C-Level), заключение контрактов от 2 млн руб.
• Контроль и снижение дебиторской задолженности, увеличение среднего чека и LTV клиентов.`,
    resume: `Дмитрий Орлов
Руководитель отдела продаж (РОП) / B2B Lead | +7 (999) 222-33-44 | dmitry.orlov@email.ru | Москва

О СЕБЕ
Коммерческий лидер с опытом 6+ лет в B2B-продажах и управлении отделом до 15 менеджеров. Доказанный трек стабильного перевыполнения плана продаж (115-135% от квартального KPI). Эксперт в AmoCRM, воронке продаж и переговорах C-Level.

ОПЫТ РАБОТЫ
Руководитель отдела B2B продаж — ТрейдВектор Солюшнс (2021 — настоящее время)
• Выстроил систему прямых и партнерских продаж, увеличив годовую выручку направления на 42% (с 38 млн до 54 млн руб.).
• Внедрил регламенты ведения сделок в AmoCRM, сократив средний цикл сделки с 35 до 14 дней.
• Лично провел переговоры и закрыл 18 стратегических контрактов с клиентами со средним чеком от 2.5 млн руб.
• Снизил уровень просроченной дебиторской задолженности с 16% до 2.1% от общего оборота портфеля.

Ведущий менеджер по корпоративным продажам — АльянсМаркет (2018 — 2021)
• Ежемесячно перевыполнял личный план продаж на 120-130%, вошел в топ-3 менеджеров компании.
• Привлек 58 новых корпоративных клиентов методом системных деловых переговоров.

КЛЮЧЕВЫЕ НАВЫКИ
B2B продажи, AmoCRM, Bitrix24, Выполнение плана продаж (KPI), Переговоры C-Level, Холодные звонки, Управление воронкой продаж, Дебиторская задолженность, Увеличение среднего чека.`,
  },
  {
    id: "marketing",
    label: "🎯 Маркетолог (Директ, SEO, CPL)",
    categoryName: "Маркетинг и PR",
    job: `Директор по маркетингу / Head of Marketing
Компания: ФинТех Маркетплейс
Локация: Москва / Удаленно

Требования:
• Опыт управления рекламными бюджетами от 5 млн руб./мес.
• Настройка сквозной аналитики на базе Яндекс.Метрики и Google Analytics 4.
• Масштабирование контекстной рекламы в Яндекс.Директ и VK Рекламе, оптимизация CAC и CPL.
• Опыт проведения A/B-тестирований, управление SEO-продвижением и лидогенерацией.`,
    resume: `Ольга Ковалева
Директор по маркетингу / Head of Marketing | +7 (999) 333-44-55 | olga.kovaleva@email.ru | Москва

О СЕБЕ
Data-driven директор по маркетингу с опытом 6+ лет в управлении рекламными бюджетами от 6 млн руб./мес. Эксперт в performance-маркетинге, сквозной аналитике, SEO-продвижении и масштабировании лидогенерации.

ОПЫТ РАБОТЫ
Head of Marketing / Ведущий маркетолог — ФинТех Маркетплейс (2021 — настоящее время)
• Управляла сплитом платных каналов (Яндекс.Директ, VK Реклама, Telegram Ads), обеспечив приток 8 500+ квалифицированных лидов ежемесячно.
• Вдрила сквозную аналитику на базе Яндекс.Метрики и GA4, снизив стоимость лида (CPL) на 32%.
• Руководила серией A/B-тестирований, увеличив конверсию посадочных страниц сайта с 2.8% до 5.4%.
• Увеличила органический поисковый трафик (SEO) в 3.2 раза за 12 месяцев.

Performance-маркетолог — Агентство Диджитал Про (2018 — 2021)
• Запустила и оптимизировала свыше 180 рекламных кампаний с возвратом инвестиций (ROMI) свыше 340%.

КЛЮЧЕВЫЕ НАВЫКИ
Яндекс.Директ, VK Реклама, Сквозная аналитика, Яндекс.Метрика, Google Analytics 4, SEO оптимизация, A/B-тестирование, Лидогенерация, Управление рекламным бюджетом, CAC / LTV / CPL.`,
  },
  {
    id: "legal",
    label: "⚖️ Корпоративный юрист",
    categoryName: "Юриспруденция и Право",
    job: `Ведущий юрисконсульт / Корпоративный юрист
Компания: Промышленный Холдинг «Энергия»
Локация: Москва

Требования:
• Полное правовое сопровождение деятельности компании, экспертиза и согласование договоров.
• Ведение претензионно-исковой работы, успешное представительство в Арбитражных судах.
• Корпоративное право, сопровождение проверок госорганов (ФАС, Роскомнадзор).
• Проверка контрагентов, комплаенс, трудовое право (ТК РФ) и гражданское право (ГК РФ).`,
    resume: `Сергей Васильев
Ведущий корпоративный юрист | +7 (999) 444-55-66 | sergey.vasiliev@email.ru | Москва

О СЕБЕ
Корпоративный юрист с опытом 6+ лет в правовом сопровождении холдинговых структур. Сильная экспертиза в договорном праве, представлении интересов в Арбитражных судах (92% успешных решений) и комплаенсе.

ОПЫТ РАБОТЫ
Ведущий юрисконсульт — Промышленный Холдинг (2021 — настоящее время)
• Руководил договорной работой по сложным контрактам (поставка, подряд, ВЭД) с портфелем свыше 850 млн руб.
• Представлял интересы компании в Арбитражных судах, выиграв 22 судебных спора и предотвратив взыскание 45 млн руб.
• Выстроил систему проверки контрагентов и комплаенса, исключив правовые риски на 100%.
• Успешно сопровождал проверки ФАС и Роскомнадзора без штрафных санкций.

Юрисконсульт — Юридическая группа (2018 — 2021)
• Составил и согласовал более 400 коммерческих договоров, сократив типовой цикл визирования на 40%.

КЛЮЧЕВЫЕ НАВЫКИ
Договорная работа, Претензионно-исковая работа, Арбитражный суд, Корпоративное право, Правовая экспертиза, Согласование контрактов, ФАС, Гражданское право (ГК РФ), Трудовое право (ТК РФ).`,
  },
  {
    id: "logistics",
    label: "🚛 Руководитель логистики (ВЭД, SCM)",
    categoryName: "Логистика и Склад",
    job: `Руководитель отдела логистики и ВЭД
Компания: Лоджистик Глобал
Локация: Санкт-Петербург / Удаленно

Требования:
• Управление цепочками поставок (SCM), складскими комплексами и внедрение систем WMS.
• Организация международных мультимодальных грузоперевозок по Инкотермс (FOB, CIF, DAP).
• Таможенное оформление, ВЭД, контроль себестоимости и снижение логистических издержек.
• Контроль соблюдения стандартов доставки OTIF не ниже 98%.`,
    resume: `Михаил Кузнецов
Руководитель отдела логистики и ВЭД | +7 (999) 555-66-77 | mikhail.kuznetsov@email.ru | Санкт-Петербург

О СЕБЕ
Руководитель логистических операций и цепей поставок с опытом 7+ лет. Эксперт в управлении складскими комплексами (до 12 000 кв.м), внедрении WMS, организации международных перевозок (ВЭД, Инкотермс).

ОПЫТ РАБОТЫ
Руководитель отдела логистики и ВЭД — Лоджистик Глобал (2021 — настоящее время)
• Управлял цепочками поставок (SCM) и распределительным центром площадью 12 000 кв.м с грузооборотом 180 тонн/день.
• Внедрил систему WMS адресного хранения и штрихкодирования, повысив скорость комплектации на 35%.
• Наладил мультимодальные маршруты импорта из Китая и Турции по правилам Инкотермс (FOB, CIF, DAP).
• Оптимизировал контрактную базу перевозчиков, обеспечив экономию бюджета на 14.8 млн руб. в год.

Ведущий специалист по логистике — ТрансБалтика (2018 — 2021)
• Обеспечивал управление автопарком из 65 единиц автотранспорта с соблюдением стандарта OTIF 98%.

КЛЮЧЕВЫЕ НАВЫКИ
Управление цепочками поставок (SCM), Складской учет (WMS), Таможенное оформление и ВЭД, Правила Инкотермс, Транспортная логистика, Оптимизация затрат, Стандарты OTIF.`,
  },
  {
    id: "it",
    label: "💻 IT-специалист (PM / Lead)",
    categoryName: "IT и Продукт",
    job: `Senior Product Manager (AI & Cloud Services)
Компания: Яндекс
Локация: Москва / Удаленно

Требования:
• 5+ лет в управлении продуктом в технологических компаниях.
• Опыт работы с Agile, Scrum, CI/CD, A/B-тестированием и метриками (Retention, LTV, Unit-экономика).
• Умение проектировать Product Strategy, формировать Roadmap и составлять PRD.
• Опыт взаимодействия с инженерами: Microservices, REST API, Cloud Infrastructure, Docker, SQL.
• Сильные навыки работы со стейкхолдерами: Stakeholder Management и Cross-functional лидерство.`,
    resume: `Алексей Морозов
Senior Product Manager | alex.morozov@email.ru | +7 (999) 123-45-67 | Москва / Удаленно

О СЕБЕ
Продуктовый менеджер с опытом 6+ лет в создании B2B SaaS и AI-платформ. Сильная экспертиза в продуктовой стратегии, формулировании гипотез, исследованиях пользователей (CJM, CustDev) и управлении бэклогом.

ОПЫТ РАБОТЫ
Ведущий Product Manager — CloudScale Solutions (2022 — настоящее время)
• Управлял продуктовым роадмапом аналитической B2B-платформы (DAU вырос с 5 000 до 45 000).
• Внедрил процесс регулярных A/B-тестирований, что увеличило конверсию в оплату на 24%.
• Составлял детальные PRD, формулировал продуктовые метрики и координировал спринты по Scrum.
• Совместно с инженерной командой интегрировал процессы с современным CI/CD пайплайном.

Product Manager — FinTech Инновации (2019 — 2022)
• Отвечал за онбординг юридических лиц и платёжный шлюз. Сократил time-to-first-value с 7 дней до 4 часов.

КЛЮЧЕВЫЕ НАВЫКИ
Product Management, Product Strategy, Roadmap Planning, CustDev, Scrum, PRD, Unit-экономика, A/B-тестирование, CI/CD, SQL, Docker, Kubernetes.`,
  },
];

export default function ATSScannerPage() {
  const {
    userProfile,
    applications,
    scannerTargetJob,
    triggerQuickAudit,
    setTriggerQuickAudit,
    isPro,
    remainingScans,
    consumeScan,
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    setUpgradeReason,
    showToast,
  } = useApp();

  const [resumeText, setResumeText] = useState(DIVERSE_PRESETS[0].resume);
  const [jobDesc, setJobDesc] = useState(DIVERSE_PRESETS[0].job);
  const [selectedTrackerJobId, setSelectedTrackerJobId] = useState<string>("");

  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
  } | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeResultsTab, setActiveResultsTab] = useState<"overview" | "raw_ats" | "xyz_diff" | "red_flags">("overview");
  const [rawViewMode, setRawViewMode] = useState<"text" | "json">("text");

  // Killer Features States: Life Situation, Batch Mode, Salary & Viral Bonus
  const [lifeSituation, setLifeSituation] = useState<"standard" | "switch" | "gap" | "junior">("standard");
  const [jobInputMode, setJobInputMode] = useState<"single" | "batch">("single");
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [viralBonusOpen, setViralBonusOpen] = useState(false);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);

  // Modals for Module 2 & Module 3
  const [isScoreCardOpen, setIsScoreCardOpen] = useState(false);
  const [isCleanResumeOpen, setIsCleanResumeOpen] = useState(false);

  // AI Enhancement Modals
  const [embedSkillModalOpen, setEmbedSkillModalOpen] = useState(false);
  const [skillToEmbed, setSkillToEmbed] = useState("");
  const [rewriteModalOpen, setRewriteModalOpen] = useState(false);
  const [saveKanbanModalOpen, setSaveKanbanModalOpen] = useState(false);
  const [buildResumeModalOpen, setBuildResumeModalOpen] = useState(false);
  const [hhCopyModalOpen, setHhCopyModalOpen] = useState(false);
  const [interviewPrepModalOpen, setInterviewPrepModalOpen] = useState(false);

  // File parsing & Job import states
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isImportingJob, setIsImportingJob] = useState(false);
  const [jobUrlInput, setJobUrlInput] = useState("");
  const [jobRoleInput, setJobRoleInput] = useState("");
  const [jobImportTab, setJobImportTab] = useState<"preset" | "url" | "ai_role">("preset");
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill target job from Kanban navigation or Library
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedResume = localStorage.getItem("launchpad_scanner_resume");
      const savedJob = localStorage.getItem("launchpad_scanner_job");
      if (savedResume) {
        setResumeText(savedResume);
        localStorage.removeItem("launchpad_scanner_resume");
      }
      if (savedJob) {
        setJobDesc(savedJob);
        localStorage.removeItem("launchpad_scanner_job");
      }
      if (savedResume || savedJob) {
        showToast("Загружен эталонный образец из библиотеки резюме!");
      }
    }

    if (scannerTargetJob) {
      setJobDesc(
        `${scannerTargetJob.position} в компании ${scannerTargetJob.company}\n\n${
          scannerTargetJob.description || "Требования: опыт в сфере, KPI, оцифрованные метрики, надежность."
        }`
      );
      showToast(`Загружены требования вакансии «${scannerTargetJob.company}»`);
    }
  }, [scannerTargetJob, showToast]);

  // Handle Quick Audit trigger from header
  useEffect(() => {
    const isQuick =
      triggerQuickAudit ||
      (typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("quick_audit") === "true");
    if (isQuick) {
      setTriggerQuickAudit(false);
      showToast("Запущен экспресс-аудит резюме...");
    }
  }, [triggerQuickAudit, setTriggerQuickAudit, showToast]);

  // Dynamic Language Detection (Russian vs English)
  const language = useMemo(() => {
    return detectLanguage(`${resumeText} ${jobDesc}`);
  }, [resumeText, jobDesc]);

  // Universal Deterministic 55/15/15/15 ATS Simulator (All Professions)
  const simulation: AtsSimulationResult = useMemo(() => {
    return simulateAtsParser(resumeText, jobDesc, language);
  }, [resumeText, jobDesc, language]);

  // Handle selecting job from Kanban tracker
  const handleSelectTrackerJob = (jobId: string | null) => {
    if (!jobId) return;
    setSelectedTrackerJobId(jobId);
    const job = applications.find((a) => a.id === jobId);
    if (job) {
      setJobDesc(
        `${job.position} в компании ${job.company}\n\n${
          job.job_description || "Требования: опыт работы, выполнение KPI, метрики эффективности."
        }`
      );
      showToast(`Выбрана вакансия «${job.company}» из Канбан-трекера`);
    }
  };

  const handleLoadPreset = (presetId: string) => {
    const p = DIVERSE_PRESETS.find((x) => x.id === presetId);
    if (p) {
      setJobDesc(p.job);
      setResumeText(p.resume);
      showToast(`Загружен эталон «${p.label}» (${p.categoryName})!`);
    }
  };

  // Handle file upload with server-side PDF / DOCX / TXT multi-parser (Module 1)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file: File | null = null;
    if ("dataTransfer" in e) {
      e.preventDefault();
      file = e.dataTransfer.files?.[0] || null;
    } else {
      file = e.target.files?.[0] || null;
    }
    if (!file) return;

    const fileSizeStr = (file.size / 1024).toFixed(1) + " KB";
    setUploadedFile({ name: file.name, size: fileSizeStr });
    setIsParsingFile(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-resume-file", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          setResumeText(data.text);
          showToast(`✓ Резюме «${file.name}» (${data.fileType || "DOC"}) успешно извлечено без искажений!`);
          setIsParsingFile(false);
          return;
        }
      }

      // Fallback: client-side reading for text formats
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text && text.trim().length > 30) {
          setResumeText(cleanAIMarkdownArtifacts(text));
          showToast(`Файл «${file.name}» загружен.`);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      console.warn("File upload error:", err);
      showToast("Ошибка при чтении файла. Проверьте формат документа.");
    } finally {
      setIsParsingFile(false);
    }
  };

  // Module 2: Import Job Vacancy by URL (HH.ru official API + Generic)
  const handleImportJobUrl = async () => {
    if (!jobUrlInput.trim()) return;
    setIsImportingJob(true);
    try {
      const res = await fetch("/api/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobUrlInput.trim() }),
      });
      const data = await res.json();
      if (data.success && data.jobDesc) {
        setJobDesc(data.jobDesc);
        showToast(`✓ Вакансия «${data.position}» (${data.company}) успешно загружена!`);
        setJobUrlInput("");
      } else if (data.antiBot) {
        showToast(data.message || "Сайт защищен капчей. Вставьте текст вакансии вручную или укажите только должность.");
      } else {
        showToast(data.error || "Не удалось загрузить вакансию по этой ссылке.");
      }
    } catch (err) {
      showToast("Ошибка соединения при загрузке вакансии.");
    } finally {
      setIsImportingJob(false);
    }
  };

  // Module 2: Generate Job Requirements from Single Role Title
  const handleGenerateRoleRequirements = async () => {
    if (!jobRoleInput.trim()) return;
    setIsImportingJob(true);
    try {
      const res = await fetch("/api/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleTitle: jobRoleInput.trim(), mode: "generate_role" }),
      });
      const data = await res.json();
      if (data.success && data.jobDesc) {
        setJobDesc(data.jobDesc);
        showToast(`✓ Требования рынка для «${jobRoleInput}» успешно сгенерированы!`);
        setJobRoleInput("");
      } else {
        showToast("Не удалось сгенерировать требования. Попробуйте ещё раз.");
      }
    } catch (err) {
      showToast("Ошибка соединения при генерации требований.");
    } finally {
      setIsImportingJob(false);
    }
  };

  // Module 3: Export to Word (.docx)
  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportResumeToDocx(resumeText);
      showToast("✓ Файл Word (.docx) успешно сгенерирован и скачан!");
    } catch (err) {
      console.error("DOCX export error:", err);
      showToast("Ошибка при создании Word документа.");
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Module 3: Export to Printable PDF
  const handleExportPdf = () => {
    exportResumeToPdf(resumeText);
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // STEP 3: Real AI Skill Embedding into Work Experience (NO "ключевой навык" stub)
  const handleOpenEmbedSkill = (skill: string) => {
    setSkillToEmbed(skill);
    setEmbedSkillModalOpen(true);
  };

  const handleApplyEmbeddedBullet = (bullet: string) => {
    setResumeText((prev) => {
      const lines = prev.split("\n");
      let inserted = false;
      const newLines: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        newLines.push(lines[i]);
        if (!inserted && /(?:опыт работы|профессиональный опыт|experience|work history)/i.test(lines[i])) {
          let j = i + 1;
          while (j < lines.length && !lines[j].trim()) {
            newLines.push(lines[j]);
            j++;
          }
          if (j < lines.length) {
            newLines.push(lines[j]); // Company line / role
            newLines.push(bullet); // Insert high-impact bullet right under company
            inserted = true;
            i = j;
          }
        }
      }

      if (inserted) return newLines.join("\n");
      return `${prev}\n\nОПЫТ РАБОТЫ\n${bullet}`;
    });

    showToast(`✓ Навык «${skillToEmbed}» оцифрован и подтвержден в опыте! Балл Hard Skills вырос.`);
  };

  // STEP 4: AI Auto-Rewrite Whole Resume
  const handleApplyRewrittenResume = (newResume: string) => {
    setResumeText(newResume);
    showToast("🎉 Резюме переписано в Harvard ATS стандарт! Балл повышен до 92%+.");
  };

  // 1-Click apply XYZ bullet improvement
  const handleApplyXyz = (item: XyzImprovement) => {
    setResumeText((prev) => {
      if (prev.includes(item.original)) {
        return prev.replace(item.original, item.improved);
      }
      return `${prev}\n• ${item.improved}`;
    });
    showToast(`✨ Буллет улучшен по формуле XYZ! +${item.scoreBoost}% к итоговому баллу ATS.`);
  };

  const handleStartScan = () => {
    if (!isPro && remainingScans <= 0) {
      setUpgradeReason("Бесплатные проверки исчерпаны. Перейдите на тариф Pro для безлимитного ATS-сканера!");
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      consumeScan();
      showToast("✓ ATS-аудит резюме завершён по стандарту 55/15/15/15!");
    }, 600);
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(cleanAIMarkdownArtifacts(text));
    setCopiedSection(sectionId);
    showToast("Текст скопирован в буфер обмена!");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    "https://launchpad-app-ashy.vercel.app"
  )}&text=${encodeURIComponent(
    language === "en"
      ? `My resume scored ${simulation.score.total}% on the LaunchPad AI PRO ATS Audit! Check yours:`
      : `Моё резюме набрало ${simulation.score.total}% в ATS-сканере LaunchPad AI PRO! Проверь своё:`
  )}`;

  const targetRoleTitle = scannerTargetJob ? `${scannerTargetJob.position} (${scannerTargetJob.company})` : simulation.domainName;

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ScanSearch className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
            <span>AI ATS-сканер резюме для ВСЕХ профессий</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Универсальный аудит по формуле 55/15/15/15 (Workday, Taleo, Greenhouse, E-Staff, Поток) для любой сферы: Продажи, Бухгалтерия, Маркетинг, Юристы, HR, IT.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* STEP 4: Rewrite Resume Button */}
          <Button
            size="sm"
            onClick={() => setRewriteModalOpen(true)}
            className="col-span-2 sm:col-span-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5 h-9"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>✨ Улучшить резюме с ИИ (до 90%+)</span>
          </Button>

          {/* STEP 5: Save to Kanban Button */}
          <Button
            size="sm"
            onClick={() => setSaveKanbanModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-1.5 h-8 sm:h-9"
          >
            <Kanban className="w-3.5 h-3.5 shrink-0" />
            <span>🚀 В Канбан</span>
          </Button>

          {/* Module 2: Score Card Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsScoreCardOpen(true)}
            className="text-xs border-border/80 hover:bg-muted/80 flex items-center justify-center gap-1.5 cursor-pointer h-8 sm:h-9"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Сертификат</span>
          </Button>

          {/* Module 3: Clean Single-Column Resume Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCleanResumeOpen(true)}
            className="text-xs border-border/80 hover:bg-muted/80 flex items-center justify-center gap-1.5 cursor-pointer h-8 sm:h-9"
          >
            <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Harvard ATS</span>
          </Button>

          {/* Viral Referral Bonus Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setViralBonusOpen(true)}
            className="text-xs border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer h-8 sm:h-9"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>🎁 +3 проверки</span>
          </Button>

          {/* AI Provider Settings Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAiSettingsOpen(true)}
            className="col-span-2 sm:col-span-1 text-xs border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer h-8 sm:h-9"
            title="Подключить бесплатные ключи Groq (Llama 3.3) или Google Gemini Flash"
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>⚡ Ключи ИИ (Groq / Gemini)</span>
          </Button>
        </div>
      </div>

      {/* Quick 1-Click Diverse Profession Presets Bar */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-card/60 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground whitespace-nowrap shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Быстрый выбор сферы:</span>
        </div>
        <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
          {DIVERSE_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleLoadPreset(p.id)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-background/80 hover:bg-primary/10 border border-border/70 hover:border-primary/40 text-foreground transition cursor-pointer whitespace-nowrap shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Life Situation Chips for AI Context Adaptation */}
          <div className="p-3 rounded-xl bg-card/60 border border-border/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5 text-foreground font-bold">
                <Target className="w-3.5 h-3.5 text-primary" />
                Жизненная ситуация:
              </span>
              <span className="text-[10px] text-primary">ИИ адаптирует буллеты</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "standard", label: "🎯 Стандартный поиск" },
                { id: "switch", label: "🔄 Смена профессии" },
                { id: "gap", label: "⏸ Перерыв в стаже" },
                { id: "junior", label: "🎓 Джуниор / мало опыта" },
              ].map((sit) => (
                <button
                  key={sit.id}
                  type="button"
                  onClick={() => {
                    setLifeSituation(sit.id as "standard" | "switch" | "gap" | "junior");
                    showToast(`Выбрано: ${sit.label}. ИИ учтёт это при оптимизации резюме.`);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition cursor-pointer flex items-center gap-1.5 ${
                    lifeSituation === sit.id
                      ? "bg-primary/15 border-primary text-primary font-semibold shadow-xs"
                      : "bg-background/50 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <span className="truncate">{sit.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card 1: Resume Input */}
          <Card
            className="bg-card border-border transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileUpload}
          >
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>1. Текст вашего резюме</span>
                </CardTitle>
                <div className="flex flex-wrap items-center gap-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.md,.pdf,.docx"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isParsingFile}
                    className="h-7 text-xs border-dashed border-primary/50 text-primary hover:bg-primary/10 cursor-pointer"
                  >
                    {isParsingFile ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Upload className="w-3 h-3 mr-1" />
                    )}
                    {isParsingFile ? "Чтение..." : "Файл (PDF, Word)"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBuildResumeModalOpen(true)}
                    className="h-7 text-xs bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
                    Собрать с нуля
                  </Button>
                </div>
              </div>
              <CardDescription className="text-xs">
                Вставьте текст, перетащите файл (.pdf, .docx, .txt) или соберите резюме за 1 минуту с ИИ
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {isParsingFile && (
                <div className="p-3 rounded-lg border border-primary/40 bg-primary/10 flex items-center gap-2 text-xs text-primary animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Извлекаем чистый текст и структуру документа без искажения шрифтов...</span>
                </div>
              )}

              {uploadedFile && !isParsingFile && (
                <div className="p-2.5 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-between text-xs animate-in fade-in">
                  <div className="flex items-center gap-2 text-foreground font-medium truncate">
                    <FileCheck className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{uploadedFile.name}</span>
                    <span className="text-muted-foreground text-[10px]">({uploadedFile.size})</span>
                  </div>
                  <button
                    onClick={handleClearFile}
                    className="text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Вставьте сюда текст вашего резюме или перетащите файл..."
                rows={12}
                className="font-mono text-xs resize-none bg-background/50 border-border"
              />
            </CardContent>
          </Card>

          {/* Vacancy Mode Switcher: Single vs Batch (Module 4) */}
          <div className="flex items-center justify-between pb-0.5">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card/80 border border-border/80 w-full">
              <button
                type="button"
                onClick={() => setJobInputMode("single")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-1 text-center ${
                  jobInputMode === "single"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Одна вакансия
              </button>
              <button
                type="button"
                onClick={() => setJobInputMode("batch")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-1 text-center flex items-center justify-center gap-1.5 ${
                  jobInputMode === "batch"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>🔥 Сравнить до 5 вакансий</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0 border-amber-500/40 text-amber-300 bg-amber-500/10 hidden sm:inline">
                  Пакетный
                </Badge>
              </button>
            </div>
          </div>

          {jobInputMode === "batch" ? (
            <BatchJobComparator
              resumeText={resumeText}
              onSelectJobForScanner={(jobTextToLoad) => {
                setJobDesc(jobTextToLoad);
                setJobInputMode("single");
                showToast("✓ Вакансия победителя загружена в сканер!");
              }}
              onToast={showToast}
            />
          ) : (
            /* Card 2: Job Description Input & Multi-Source Importer (Module 2) */
            <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>2. Требования вакансии</span>
                </CardTitle>
                <Badge variant="outline" className="text-[10px] text-primary border-primary/30 bg-primary/10">
                  {simulation.domainName}
                </Badge>
              </div>

              {/* Import Mode Switcher */}
              <div className="flex gap-1.5 pt-2">
                <button
                  onClick={() => setJobImportTab("preset")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                    jobImportTab === "preset"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Текст вакансии
                </button>
                <button
                  onClick={() => setJobImportTab("url")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer flex items-center gap-1 ${
                    jobImportTab === "url"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Link2 className="w-3 h-3 text-red-400" />
                  <span>Ссылка (HH.ru)</span>
                </button>
                <button
                  onClick={() => setJobImportTab("ai_role")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer flex items-center gap-1 ${
                    jobImportTab === "ai_role"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Wand2 className="w-3 h-3 text-amber-400" />
                  <span>Собрать по должности</span>
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {jobImportTab === "url" && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-red-300 block">
                    Вставьте ссылку на вакансию (HeadHunter, SuperJob, Habr):
                  </span>
                  <div className="flex gap-2">
                    <Input
                      value={jobUrlInput}
                      onChange={(e) => setJobUrlInput(e.target.value)}
                      placeholder="https://hh.ru/vacancy/12345678"
                      className="text-xs h-8 bg-background/80"
                    />
                    <Button
                      size="sm"
                      onClick={handleImportJobUrl}
                      disabled={isImportingJob || !jobUrlInput.trim()}
                      className="bg-red-600 hover:bg-red-500 text-white text-xs h-8 px-3 font-bold cursor-pointer"
                    >
                      {isImportingJob ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Загрузить"}
                    </Button>
                  </div>
                </div>
              )}

              {jobImportTab === "ai_role" && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-amber-300 block">
                    Укажите только профессию — ИИ соберет реальные требования рынка:
                  </span>
                  <div className="flex gap-2">
                    <Input
                      value={jobRoleInput}
                      onChange={(e) => setJobRoleInput(e.target.value)}
                      placeholder="Например: Главный бухгалтер или Менеджер по продажам B2B"
                      className="text-xs h-8 bg-background/80"
                    />
                    <Button
                      size="sm"
                      onClick={handleGenerateRoleRequirements}
                      disabled={isImportingJob || !jobRoleInput.trim()}
                      className="bg-amber-600 hover:bg-amber-500 text-white text-xs h-8 px-3 font-bold cursor-pointer"
                    >
                      {isImportingJob ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Собрать"}
                    </Button>
                  </div>
                </div>
              )}

              {applications.length > 0 && jobImportTab === "preset" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-primary" />
                      Выбрать из Канбан-трекера:
                    </span>
                  </div>
                  <Select value={selectedTrackerJobId} onValueChange={handleSelectTrackerJob}>
                    <SelectTrigger className="text-xs h-8 bg-background/60">
                      <SelectValue placeholder="Или выберите сохранённую вакансию..." />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map((app) => (
                        <SelectItem key={app.id} value={app.id} className="text-xs">
                          {app.company} — {app.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Вставьте текст требований вакансии (бухгалтер, менеджер продаж, маркетолог, юрист, логист, HR, IT)..."
                rows={8}
                className="font-mono text-xs resize-none bg-background/50 border-border"
              />

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs shadow-md shadow-primary/20 cursor-pointer h-9"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Сканирование алгоритмами ATS...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Пересчитать ATS Match ({simulation.domainName})
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setRewriteModalOpen(true)}
                  variant="outline"
                  className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs font-bold h-9 cursor-pointer"
                  title="Переписать резюме под эту вакансию с ИИ"
                >
                  <Wand2 className="w-3.5 h-3.5 mr-1" />
                  <span>ИИ</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          )}
        </div>

        {/* Right Column: ATS Report & Score (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-card border-border overflow-hidden">
            {/* Top Score Summary Banner */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-card via-card to-primary/10 border-b border-border/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
                    <span>Индекс соответствия ({simulation.domainName})</span>
                    <Badge variant="outline" className="text-[9px] text-primary border-primary/30 bg-primary/10">
                      Стандарт 55/15/15/15
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                      {simulation.score.total}%
                    </span>
                    <span className="text-muted-foreground text-sm font-medium">/ 100%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md">
                    {simulation.score.total >= 80
                      ? `Отличный результат! Резюме проходит автоматические фильтры ATS для сферы «${simulation.domainName}».`
                      : simulation.score.total >= 65
                      ? `Средний балл. Добавьте подтверждения в буллеты опыта и устраните сиротские навыки.`
                      : `Высокий риск отсева. Нажмите «✨ Улучшить резюме с ИИ», чтобы поднять балл до 90%+.`}
                  </p>
                </div>

                {/* Circular indicator */}
                <div className="relative w-24 h-24 rounded-full border-4 border-muted flex items-center justify-center shrink-0">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-primary transition-all duration-500"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${simulation.score.total >= 25 ? "100% 0%," : ""}${
                        simulation.score.total >= 50 ? "100% 100%," : ""
                      }${simulation.score.total >= 75 ? "0% 100%," : ""}0% 0%)`,
                    }}
                  />
                  <div className="text-center">
                    <span className="text-base font-black">{simulation.score.total}%</span>
                    <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">match</span>
                  </div>
                </div>
              </div>

              {/* 4 Formula Progress Bars (55 / 15 / 15 / 15) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-border/60">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Hard Skills</span>
                    <span className="font-bold text-indigo-400">{simulation.score.hardSkills}/55</span>
                  </div>
                  <Progress value={(simulation.score.hardSkills / 55) * 100} className="h-1.5" />
                  <span className="text-[10px] text-muted-foreground block truncate">Цитаты в опыте</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Метрики</span>
                    <span className="font-bold text-emerald-400">{simulation.score.metrics}/15</span>
                  </div>
                  <Progress value={(simulation.score.metrics / 15) * 100} className="h-1.5" />
                  <span className="text-[10px] text-muted-foreground block truncate">%, руб, млн, время</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Soft Skills</span>
                    <span className="font-bold text-sky-400">{simulation.score.softSkills}/15</span>
                  </div>
                  <Progress value={(simulation.score.softSkills / 15) * 100} className="h-1.5" />
                  <span className="text-[10px] text-muted-foreground block truncate">Лидерство, процесс</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Вёрстка</span>
                    <span className="font-bold text-amber-400">{simulation.score.layout}/15</span>
                  </div>
                  <Progress value={(simulation.score.layout / 15) * 100} className="h-1.5" />
                  <span className="text-[10px] text-muted-foreground block truncate">1 колонка Harvard</span>
                </div>
              </div>

              {/* Actions row under score (Modules 3, 4, 5) */}
              <div className="mt-4 pt-3 border-t border-border/60 space-y-2.5 text-xs">
                {/* Top Action Row: AI Rewrite, Interview Prep, Save to Kanban */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setRewriteModalOpen(true)}
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm shadow-emerald-600/25 cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>✨ Улучшить до 90%+ с ИИ</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInterviewPrepModalOpen(true)}
                      className="h-8 text-xs border-purple-500/40 text-purple-300 hover:bg-purple-500/10 font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      <Target className="w-3.5 h-3.5 text-purple-400" />
                      <span>🎯 Подготовка к интервью</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSaveKanbanModalOpen(true)}
                      className="h-8 text-xs border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      <Kanban className="w-3.5 h-3.5 text-indigo-400" />
                      <span>🚀 В Канбан + Письмо</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSalaryModalOpen(true)}
                      className="h-8 text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>💰 Торг по зарплате (+20%)</span>
                    </Button>
                  </div>
                </div>

                {/* Bottom Export & Sharing Row (Real DOCX, PDF, HH.ru, Certificate) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportDocx}
                      disabled={isExportingDocx}
                      className="h-7 text-xs border-border/80 hover:bg-muted text-foreground cursor-pointer flex items-center gap-1"
                      title="Скачать резюме в формате Microsoft Word (.docx)"
                    >
                      {isExportingDocx ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileDown className="w-3 h-3 text-blue-400" />}
                      <span>Word (.docx)</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportPdf}
                      className="h-7 text-xs border-border/80 hover:bg-muted text-foreground cursor-pointer flex items-center gap-1"
                      title="Открыть печать и сохранить как PDF с поддержкой кириллицы"
                    >
                      <Printer className="w-3 h-3 text-amber-400" />
                      <span>Печать / PDF</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setHhCopyModalOpen(true)}
                      className="h-7 text-xs border-red-500/30 text-red-300 hover:bg-red-500/10 cursor-pointer flex items-center gap-1"
                      title="Разбить резюме на блоки для вставки на HeadHunter"
                    >
                      <Copy className="w-3 h-3 text-red-400" />
                      <span>Копировать для HH.ru</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsScoreCardOpen(true)}
                      className="h-7 text-xs border-border/80 hover:bg-muted text-emerald-400 font-medium cursor-pointer"
                    >
                      <Award className="w-3 h-3 mr-1" />
                      Сертификат ATS
                    </Button>
                  </div>

                  <a
                    href={telegramShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium transition cursor-pointer text-sky-400"
                  >
                    <Send className="w-3 h-3" />
                    Поделиться
                  </a>
                </div>
              </div>
            </div>

            {/* Tab Switcher for 3 Modes */}
            <div className="px-3 sm:px-5 pt-3 pb-2 border-b border-border/70 flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveResultsTab("overview")}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeResultsTab === "overview"
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Анализ и навыки</span>
              </button>

              <button
                onClick={() => setActiveResultsTab("raw_ats")}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeResultsTab === "raw_ats"
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Глазами робота ATS</span>
                {simulation.layoutIssues.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveResultsTab("xyz_diff")}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeResultsTab === "xyz_diff"
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>X-Y-Z Улучшатель ({simulation.xyzImprovements.length})</span>
              </button>

              <button
                onClick={() => setActiveResultsTab("red_flags")}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeResultsTab === "red_flags"
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Flag className="w-3.5 h-3.5 text-rose-400" />
                <span>🚩 Рентген вакансии</span>
              </button>
            </div>

            <CardContent className="p-5 sm:p-6 space-y-6">
              {/* TAB 1: OVERVIEW & SKILLS */}
              {activeResultsTab === "overview" && (
                <div className="space-y-6">
                  {/* Missing Keywords Box with Real AI Embedding */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Отсутствующие навыки в вакансии ({simulation.missingSkills.length})
                      </h3>
                      <span className="text-[10px] text-muted-foreground">Нажмите, чтобы встроить в опыт с ИИ</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {simulation.missingSkills.length === 0 ? (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Все ключевые навыки вакансии найдены и подтверждены в опыте!
                        </span>
                      ) : (
                        simulation.missingSkills.map((kw, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOpenEmbedSkill(kw)}
                            title={`Нажмите, чтобы встроить «${kw}» в опыт работы через нейросеть`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-medium transition cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>{kw}</span>
                            <span className="text-[10px] opacity-70 ml-0.5">+ ИИ</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Verified Keywords Box */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Подтвержденные навыки с цитатами ({simulation.verifiedSkills.length})
                      </h3>
                      <span className="text-[10px] text-muted-foreground">Формула 55/15/15/15: начислены баллы</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {simulation.verifiedSkills.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                          title={item.quote}
                        >
                          ✓ {item.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Orphan Skills Warning */}
                  {simulation.orphanSkills.length > 0 && (
                    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Сиротские навыки: указаны в списке, но дают 0 баллов</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        По формуле роботов ATS навыки, которые есть только в шапке/списке, но не имеют подтверждения в описании реального опыта, не засчитываются.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {simulation.orphanSkills.map((o, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOpenEmbedSkill(o.name)}
                            title="Нажмите, чтобы встроить этот навык в описание опыта с помощью ИИ"
                            className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-white border border-amber-500/20 font-mono transition cursor-pointer flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>⚠️ {o.name} (0 б.)</span>
                            <span className="text-[9px] underline">Встроить в опыт</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actionable Steps */}
                  <div className="space-y-3 pt-3 border-t border-border/80">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Рекомендации по оптимизации:
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                        1. Перенесите сиротские навыки в конкретные буллеты опыта с указанием контекста проекта.
                      </div>
                      <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                        2. Оцифруйте достижения по формуле XYZ: Достиг [X], измерив [Y], сделав [Z].
                      </div>
                      <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                        3. Используйте эталонную 1-колоночную верстку стандарта Harvard / BigTech.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RAW ATS PARSER VIEW */}
              {activeResultsTab === "raw_ats" && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-background/60 border border-border">
                    <div>
                      <div className="text-xs font-bold text-foreground flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Симулятор токенизации и AST-дерева робота ATS</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Показывает резюме точно так, как его видят парсеры Workday, Taleo и Greenhouse
                      </p>
                    </div>

                    <div className="flex p-0.5 rounded-lg bg-background border border-border text-xs shrink-0">
                      <button
                        onClick={() => setRawViewMode("text")}
                        className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                          rawViewMode === "text"
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Сырой поток (OCR)
                      </button>
                      <button
                        onClick={() => setRawViewMode("json")}
                        className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                          rawViewMode === "json"
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        JSON AST
                      </button>
                    </div>
                  </div>

                  {/* Red Layout Anomalies */}
                  {simulation.layoutIssues.length > 0 && (
                    <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-2.5">
                      <div className="text-xs font-bold text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        <span>Критические ошибки вёрстки и структуры для ATS ({simulation.layoutIssues.length}):</span>
                      </div>
                      <div className="space-y-2">
                        {simulation.layoutIssues.map((issue) => (
                          <div key={issue.id} className="p-2.5 rounded-lg bg-background/60 border border-rose-500/30 text-xs">
                            <div className="font-semibold text-rose-200">{issue.title}</div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{issue.description}</p>
                            <span className="text-[10px] font-mono text-rose-400 block mt-1">Триггер: {issue.evidence}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw Stream Viewer */}
                  <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs overflow-x-auto max-h-[380px]">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-400">
                      <span>{rawViewMode === "text" ? "TOKENIZED RAW STREAM" : "ATS_AST_SCHEMA.json"}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard(
                            rawViewMode === "text"
                              ? simulation.rawTextStream
                              : JSON.stringify(simulation.parsedAstJson, null, 2),
                            "raw_ast"
                          )
                        }
                        className="h-6 text-[10px] text-zinc-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Копировать
                      </Button>
                    </div>
                    <pre className="text-zinc-300 leading-relaxed">
                      {rawViewMode === "text"
                        ? simulation.rawTextStream
                        : JSON.stringify(simulation.parsedAstJson, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 3: XYZ BULLET IMPROVER */}
              {activeResultsTab === "xyz_diff" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <Wand2 className="w-4 h-4" />
                      <span>Формула Google X-Y-Z: Достиг [X], измерив [Y], сделав [Z]</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Слабые фразы («отвечал за», «занимался») снижают шансы на интервью на 70%. Замените их на оцифрованные достижения в 1 клик:
                    </p>
                  </div>

                  <div className="space-y-3">
                    {simulation.xyzImprovements.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-border bg-card/60 hover:border-primary/40 transition space-y-3 text-xs"
                      >
                        {/* Before */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Слабая формулировка (Было):
                          </span>
                          <div className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 text-rose-200 line-through font-mono">
                            {item.original}
                          </div>
                        </div>

                        {/* After */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Улучшено по формуле X-Y-Z (Стало):
                          </span>
                          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 font-mono font-medium">
                            {item.improved}
                          </div>
                        </div>

                        {/* Action row */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="text-[11px] text-muted-foreground">
                            Внедрены метрики: <strong className="text-emerald-400">{item.metricsAdded.join(", ")}</strong>
                          </span>

                          <Button
                            size="sm"
                            onClick={() => handleApplyXyz(item)}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-sm shadow-emerald-500/20 flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Применить в 1 клик</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: JOB RED FLAGS & TOXICITY ANALYZER */}
              {activeResultsTab === "red_flags" && (
                <div className="space-y-4 animate-in fade-in">
                  <JobRedFlagsCard
                    jobText={jobDesc}
                    companyName="Работодатель"
                    positionName={simulation.domainName || targetRoleTitle}
                    onToast={showToast}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* STEP 3: Real AI Embed Skill Modal */}
      <AiEmbedSkillModal
        isOpen={embedSkillModalOpen}
        onClose={() => setEmbedSkillModalOpen(false)}
        skillName={skillToEmbed}
        jobTitle={targetRoleTitle}
        resumeText={resumeText}
        onApplyBullet={handleApplyEmbeddedBullet}
      />

      {/* STEP 4: AI Auto-Rewrite Modal */}
      <AiRewriteResumeModal
        isOpen={rewriteModalOpen}
        onClose={() => setRewriteModalOpen(false)}
        currentResume={resumeText}
        jobDescription={jobDesc}
        currentScore={simulation.score.total}
        missingSkills={simulation.missingSkills}
        initialLifeSituation={lifeSituation}
        onApplyRewritten={handleApplyRewrittenResume}
      />

      {/* STEP 5: Save to Kanban Pipeline Modal */}
      <SaveToKanbanModal
        isOpen={saveKanbanModalOpen}
        onClose={() => setSaveKanbanModalOpen(false)}
        resumeText={resumeText}
        jobDescription={jobDesc}
        atsScore={simulation.score.total}
      />

      {/* Module 2: Viral ATS Score Card Modal (Canvas) */}
      <AtsScoreCardModal
        isOpen={isScoreCardOpen}
        onClose={() => setIsScoreCardOpen(false)}
        simulation={simulation}
        candidateName={userProfile.name}
        targetRole={targetRoleTitle}
        language={language}
      />

      {/* Module 3: Clean Single-Column Harvard ATS Resume Modal */}
      <AtsCleanResumeModal
        isOpen={isCleanResumeOpen}
        onClose={() => setIsCleanResumeOpen(false)}
        rawResumeText={resumeText}
        candidateName={userProfile.name}
        candidateEmail={userProfile.email}
        candidatePhone={userProfile.phone}
        targetRole={targetRoleTitle}
        language={language}
      />

      {/* Module 1: Build Resume from Scratch with AI */}
      <AiBuildResumeModal
        open={buildResumeModalOpen}
        onOpenChange={setBuildResumeModalOpen}
        onApplyResume={(newResume) => {
          setResumeText(newResume);
          showToast("✓ Резюме успешно сгенерировано с ИИ и помещено в сканер!");
        }}
        defaultRole={targetRoleTitle}
      />

      {/* Module 3: Smart Copy for HeadHunter */}
      <HhCopyModal
        open={hhCopyModalOpen}
        onOpenChange={setHhCopyModalOpen}
        resumeText={resumeText}
      />

      {/* Module 5: AI Interview Prep */}
      <AiInterviewPrepModal
        open={interviewPrepModalOpen}
        onOpenChange={setInterviewPrepModalOpen}
        company={scannerTargetJob?.company || "Целевая компания"}
        position={scannerTargetJob?.position || simulation.domainName}
        resumeText={resumeText}
        jobDesc={jobDesc}
      />

      {/* Upgrade Pro Modal (Tribute) */}
      <UpgradeProModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onActivated={() => {
          showToast("🎉 Тариф LaunchPad AI PRO успешно активирован!");
        }}
      />

      {/* Module 2: AI Salary Negotiator Modal */}
      <SalaryNegotiatorModal
        open={salaryModalOpen}
        onOpenChange={setSalaryModalOpen}
        positionName={simulation.domainName || targetRoleTitle}
        companyName={scannerTargetJob?.company || "Работодатель"}
        resumeText={resumeText}
        defaultOfferedSalary="180 000 ₽"
        onToast={showToast}
      />

      {/* Module 5: Viral Referral Bonus Modal */}
      <ViralBonusModal
        isOpen={viralBonusOpen}
        onClose={() => setViralBonusOpen(false)}
      />

      {/* Free AI Provider Settings (Groq / Gemini) */}
      <AiSettingsModal
        isOpen={aiSettingsOpen}
        onClose={() => setAiSettingsOpen(false)}
      />
    </div>
  );
}
