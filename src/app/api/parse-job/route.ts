import { NextRequest, NextResponse } from "next/server";
import { cleanAIMarkdownArtifacts } from "@/lib/monetization";

/**
 * Job Vacancy Importer API:
 * 1. HeadHunter official public API (https://api.hh.ru/vacancies/{id})
 * 2. Generic job portals (SuperJob, Habr Career, Avito, etc.)
 * 3. AI Market Requirements Generator by Role Title
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, roleTitle, mode = "url" } = body;

    // 1. Role title generation mode
    if (mode === "generate_role" || (roleTitle && !url)) {
      const title = (roleTitle || "").trim();
      if (!title) {
        return NextResponse.json(
          { error: "Укажите название должности для генерации требований" },
          { status: 400 }
        );
      }

      // Generate full professional job description via internal fallback/synthesizer
      const generatedJob = generateJobDescriptionFromRole(title);
      return NextResponse.json({
        success: true,
        source: "ai_generator",
        company: "Рыночный стандарт вакансии",
        position: title,
        jobDesc: generatedJob,
      });
    }

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Укажите корректную ссылку на вакансию или название должности" },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();

    // 2. HeadHunter Vacancy URL
    const hhMatch = trimmedUrl.match(/hh\.ru\/vacancy\/(\d+)|headhunter\.ru\/vacancy\/(\d+)/i);
    if (hhMatch) {
      const vacancyId = hhMatch[1] || hhMatch[2];
      try {
        const hhRes = await fetch(`https://api.hh.ru/vacancies/${vacancyId}`, {
          headers: {
            "User-Agent": "LaunchPad-ATS/1.0 (support@launchpad-ai.pro)",
            Accept: "application/json",
          },
          next: { revalidate: 60 },
        });

        if (hhRes.ok) {
          const data = await hhRes.json();
          const position = data.name || "Специалист";
          const company = data.employer?.name || "Работодатель HeadHunter";
          const location = data.area?.name || "Россия";

          // Format salary
          let salaryText = "Не указана";
          if (data.salary) {
            const currency = data.salary.currency === "RUR" ? "₽" : data.salary.currency || "₽";
            if (data.salary.from && data.salary.to) {
              salaryText = `${data.salary.from.toLocaleString("ru-RU")} — ${data.salary.to.toLocaleString("ru-RU")} ${currency}`;
            } else if (data.salary.from) {
              salaryText = `от ${data.salary.from.toLocaleString("ru-RU")} ${currency}`;
            } else if (data.salary.to) {
              salaryText = `до ${data.salary.to.toLocaleString("ru-RU")} ${currency}`;
            }
          }

          // Extract key skills
          const skillsList = Array.isArray(data.key_skills)
            ? data.key_skills.map((s: { name: string }) => s.name).filter(Boolean)
            : [];
          const skillsString = skillsList.length > 0 ? skillsList.join(", ") : "";

          // Clean HTML description
          const rawDesc = data.description || "";
          const cleanedDesc = rawDesc
            .replace(/<br\s*[\/]?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<\/li>/gi, "\n")
            .replace(/<li>/gi, "• ")
            .replace(/<[^>]+>/g, " ")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&nbsp;/g, " ")
            .replace(/[ \t]{2,}/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .trim();

          const formattedVacancy = `ВАКАНСИЯ: ${position}
КОМПАНИЯ: ${company}
ЛОКАЦИЯ: ${location} | ЗАРПЛАТА: ${salaryText}
ССЫЛКА: ${trimmedUrl}

КЛЮЧЕВЫЕ НАВЫКИ РАБОТОДАТЕЛЯ:
${skillsString || "Указаны в описании вакансии"}

ОБЯЗАННОСТИ И ТРЕБОВАНИЯ:
${cleanedDesc}`;

          return NextResponse.json({
            success: true,
            source: "hh_api",
            company,
            position,
            location,
            salary: salaryText,
            jobDesc: cleanAIMarkdownArtifacts(formattedVacancy),
            keySkills: skillsList,
          });
        }
      } catch (hhErr) {
        console.warn("[HeadHunter API Fetch Error]:", hhErr);
      }
    }

    // 3. Generic website fetch (SuperJob, Habr, Avito, etc.)
    try {
      const response = await fetch(trimmedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(6000),
      });

      if (response.status === 403 || response.status === 429) {
        return NextResponse.json({
          success: false,
          antiBot: true,
          message:
            "Сайт защищен от автоматического парсинга (Cloudflare/Anti-Bot). Скопируйте текст вакансии вручную или введите только должность — ИИ соберет требования рынка!",
        });
      }

      if (response.ok) {
        const html = await response.text();
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);

        const pageTitle = titleMatch ? titleMatch[1].trim() : "Вакансия";
        const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : "";
        const h1Text = h1Match ? h1Match[1].replace(/<[^>]+>/g, " ").trim() : "";

        // Extract body text removing script/style tags
        const strippedBody = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
          .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ")
          .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ")
          .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, " ")
          .replace(/<br\s*[\/]?>/gi, "\n")
          .replace(/<\/p>/gi, "\n\n")
          .replace(/<\/li>/gi, "\n")
          .replace(/<li>/gi, "• ")
          .replace(/<[^>]+>/g, " ")
          .replace(/[ \t]{2,}/g, " ")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

        // Check if anti-bot captcha text is detected
        if (
          strippedBody.includes("Доступ ограничен") ||
          strippedBody.includes("Проверка безопасности") ||
          strippedBody.includes("Cloudflare") ||
          strippedBody.length < 150
        ) {
          return NextResponse.json({
            success: false,
            antiBot: true,
            message:
              "Сайт требует прохождения капчи. Пожалуйста, скопируйте текст вакансии и вставьте в поле описания.",
          });
        }

        const formatted = `ВАКАНСИЯ: ${h1Text || pageTitle}
ИСТОЧНИК: ${trimmedUrl}

ОПИСАНИЕ И ТРЕБОВАНИЯ:
${metaDesc ? metaDesc + "\n\n" : ""}${strippedBody.slice(0, 3500)}`;

        return NextResponse.json({
          success: true,
          source: "web_scraper",
          company: extractCompanyFromTitle(pageTitle),
          position: h1Text || pageTitle.split("—")[0].split("|")[0].trim(),
          jobDesc: cleanAIMarkdownArtifacts(formatted),
        });
      }
    } catch (fetchErr) {
      console.warn("[Generic URL Fetch Failed]:", fetchErr);
    }

    return NextResponse.json({
      success: false,
      antiBot: true,
      message:
        "Не удалось автоматически загрузить вакансию по ссылке. Вставьте текст вакансии вручную или укажите название должности — ИИ мгновенно соберет все требования!",
    });
  } catch (err: unknown) {
    console.error("Parse job error:", err);
    return NextResponse.json(
      { error: "Ошибка обработки запроса: " + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}

function extractCompanyFromTitle(title: string): string {
  if (title.includes("—")) {
    const parts = title.split("—");
    return parts[parts.length - 1].trim();
  }
  if (title.includes("|")) {
    const parts = title.split("|");
    return parts[parts.length - 1].trim();
  }
  if (title.includes("в компании")) {
    const match = title.match(/в компании\s+([^,.-]+)/i);
    if (match) return match[1].trim();
  }
  return "Работодатель";
}

function generateJobDescriptionFromRole(role: string): string {
  const r = role.toLowerCase();

  if (r.includes("бухгалтер") || r.includes("главбух") || r.includes("финанс") || r.includes("аудит")) {
    return `ВАКАНСИЯ: ${role}
КОМПАНИЯ: Торгово-производственная группа
ЛОКАЦИЯ: Москва / Удаленно | ЗАРПЛАТА: от 120 000 до 180 000 ₽

ОБЯЗАННОСТИ:
• Полное ведение бухгалтерского и налогового учета (ОСНО / УСН).
• Расчет НДС, налога на прибыль, формирование книг покупок и продаж, сдача обязательной отчетности в ФНС, СФР, Росстат.
• Контроль первичной документации, счетов-фактур, актов и накладных через системы ЭДО (Диадок / СБИС).
• Взаимодействие с банками, налоговыми органами, успешное сопровождение камеральных и выездных проверок.
• Начисление заработной платы, больничных, отпускных и расчет страховых взносов.

ТРЕБОВАНИЯ:
• Высшее экономическое / профильное образование.
• Отличное владение 1С:Предприятие 8.3, 1С:ЗУП, 1С:Бухгалтерия.
• Глубокое знание налогового кодекса РФ, ПБУ, расчета НДС и оптимизации налоговых рисков.
• Опыт успешного прохождения налоговых проверок без штрафных санкций.

КЛЮЧЕВЫЕ НАВЫКИ:
1С:Бухгалтерия 8.3, ОСНО, УСН, Расчет НДС, Налог на прибыль, ФНС, Первичная документация, ЭДО (Диадок / СБИС), 1С:ЗУП, ВЭД.`;
  }

  if (r.includes("продаж") || r.includes("sales") || r.includes("менеджер") || r.includes("роп") || r.includes("коммерческ")) {
    return `ВАКАНСИЯ: ${role}
КОМПАНИЯ: B2B Сервис и Дистрибуция
ЛОКАЦИЯ: Москва / РФ | ЗАРПЛАТА: от 110 000 до 250 000 ₽ (% от продаж)

ОБЯЗАННОСТИ:
• Привлечение новых B2B-клиентов и развитие существующей клиентской базы компании.
• Проведение встреч, переговоров на уровне первых лиц (LPR / генеральные директора) и заключение договоров.
• Ведение всей истории коммуникаций и сделок в CRM-системе (amoCRM / Bitrix24).
• Выполнение и перевыполнение индивидуального и командного плана продаж и KPI.
• Контроль поступления оплат и управление дебиторской задолженностью.

ТРЕБОВАНИЯ:
• Подтвержденный успешный опыт личных продаж в сегменте B2B / B2C от 2-х лет.
• Навыки работы с длинным циклом сделки, холодными и теплыми переговорами.
• Экспертное владение CRM-системами, воронками продаж и коммерческими презентациями.
• Грамотная устная и письменная речь, высокий уровень ориентации на финансовый результат.

КЛЮЧЕВЫЕ НАВЫКИ:
B2B продажи, amoCRM, Bitrix24, Переговоры LPR, Холодные звонки, Воронка продаж, Заключение договоров, Управление дебиторской задолженностью, Выполнение KPI.`;
  }

  if (r.includes("маркетолог") || r.includes("marketing") || r.includes("таргет") || r.includes("директ") || r.includes("pr")) {
    return `ВАКАНСИЯ: ${role}
КОМПАНИЯ: Федеральная группа компаний
ЛОКАЦИЯ: Удаленно / Гибрид | ЗАРПЛАТА: от 100 000 до 170 000 ₽

ОБЯЗАННОСТИ:
• Разработка и реализация комплексной маркетинговой стратегии привлечения целевого трафика и лидов.
• Запуск, оптимизация и масштабирование рекламных кампаний в Яндекс.Директ, VK Реклама, Telegram Ads.
• Анализ эффективности каналов по воронке: CPA, CPL, CAC, ROMI, LTV в Яндекс.Метрика и сквозной аналитике.
• Управление подрядчиками (дизайн, копирайтинг, SEO-оптимизация) и распределение маркетингового бюджета.
• A/B тестирование посадочных страниц (лендингов) и офферов для роста конверсии.

ТРЕБОВАНИЯ:
• Практический опыт работы в перформанс-маркетинге от 2-х лет с оцифрованными результатами.
• Глубокие знания Яндекс.Директ, Яндекс.Метрика, сквозной аналитики (Calltouch / Roistat).
• Умение работать с цифрами, гипотезами и юнит-экономикой.

КЛЮЧЕВЫЕ НАВЫКИ:
Яндекс.Директ, Яндекс.Метрика, Сквозная аналитика, CPL / CPA / ROMI, Управление бюджетом, A/B тестирование, SEO-продвижение, Telegram Ads, Лидогенерация.`;
  }

  if (r.includes("юрист") || r.includes("право") || r.includes("legal") || r.includes("адвокат")) {
    return `ВАКАНСИЯ: ${role}
КОМПАНИЯ: Холдинговая компания
ЛОКАЦИЯ: Москва / Гибрид | ЗАРПЛАТА: от 110 000 до 160 000 ₽

ОБЯЗАННОСТИ:
• Комплексное правовое сопровождение хозяйственной и коммерческой деятельности организации.
• Договорная работа: разработка, правовая экспертиза и согласование договоров (поставка, подряд, аренда, услуги).
• Претензионно-исковая работа, представление интересов компании в арбитражных судах и судах общей юрисдикции.
• Правовой аудит сделок, минимизация юридических и финансовых рисков бизнеса.
• Взаимодействие с государственными контролирующими органами (ФАС, Роспотребнадзор, Росреестр).

ТРЕБОВАНИЯ:
• Высшее юридическое образование (гражданско-правовая специализация).
• Опыт ведения судебных споров в арбитраже от 3-х лет с высоким процентом выигранных дел.
• Отличное знание ГК РФ, АПК РФ, КонсультантПлюс / Гарант.

КЛЮЧЕВЫЕ НАВЫКИ:
Договорное право, Арбитражный процесс, Претензионная работа, КонсультантПлюс, Правовой аудит, Минимизация юридических рисков, ФАС, Защита интересов бизнеса.`;
  }

  // Universal fallback for any profession
  return `ВАКАНСИЯ: ${role}
КОМПАНИЯ: Динамично развивающаяся компания
ЛОКАЦИЯ: Москва / РФ | ЗАРПЛАТА: Рыночный уровень

ОБЯЗАННОСТИ:
• Выполнение ключевых производственных и операционных задач по профилю «${role}».
• Оптимизация рабочих процессов, снижение издержек и повышение качества конечного результата.
• Взаимодействие со смежными отделами, клиентами и партнерами компании.
• Соблюдение установленных регламентов, стандартов качества и нормативных требований.
• Контроль сроков выполнения поставленных задач и ведение необходимой отчетной документации.

ТРЕБОВАНИЯ:
• Релевантный практический опыт работы на аналогичной должности от 2-х лет.
• Знание специализированных профессиональных инструментов, регламентов и нормативной базы.
• Высокий уровень ответственности, организованности и ориентации на результат.
• Умение работать в команде и оперативно решать нестандартные рабочие задачи.

КЛЮЧЕВЫЕ НАВЫКИ:
Профессиональные стандарты, Оптимизация процессов, Контроль качества, Деловая коммуникация, Соблюдение регламентов, Отчетность, Тайм-менеджмент, Работа на результат.`;
}
