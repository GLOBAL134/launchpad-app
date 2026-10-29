import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

function cleanHtmlDescription(html: string): string {
  if (!html) return "";
  return html
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
}

function formatSalary(salaryObj: any): string {
  if (!salaryObj) return "Не указана";
  const currency =
    salaryObj.currency === "RUR" || salaryObj.currency === "RUB"
      ? "₽"
      : salaryObj.currency || "₽";
  if (salaryObj.from && salaryObj.to) {
    return `${salaryObj.from.toLocaleString("ru-RU")} — ${salaryObj.to.toLocaleString("ru-RU")} ${currency}`;
  }
  if (salaryObj.from) {
    return `от ${salaryObj.from.toLocaleString("ru-RU")} ${currency}`;
  }
  if (salaryObj.to) {
    return `до ${salaryObj.to.toLocaleString("ru-RU")} ${currency}`;
  }
  return "Не указана";
}

/** Parses public HH.ru vacancy web page when api.hh.ru blocks or has DDoS-Guard */
async function scrapeHhVacancyWeb(vacancyId: string) {
  const url = `https://hh.ru/vacancy/${vacancyId}`;
  const resp = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    },
    next: { revalidate: 60 },
  });

  if (!resp.ok) {
    throw new Error(`Web page returned status ${resp.status}`);
  }

  const html = await resp.text();

  let position = "Специалист";
  let company = "Работодатель";
  let descriptionHtml = "";
  let location = "РФ";
  let salary = "Не указана";

  // 1. Extract JSON-LD JobPosting
  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
  for (const block of jsonLdMatches) {
    try {
      const jsonContent = block.replace(/<\/?script[^>]*>/gi, "");
      const d = JSON.parse(jsonContent);
      if (d["@type"] === "JobPosting") {
        if (d.title) position = String(d.title).trim();
        if (d.hiringOrganization?.name) company = String(d.hiringOrganization.name).trim();
        if (d.description) descriptionHtml = d.description;
        if (d.jobLocation?.address?.addressLocality) {
          location = String(d.jobLocation.address.addressLocality).trim();
        }
      }
    } catch {
      // ignore json parse error
    }
  }

  // 2. Extract Salary from tags
  const salaryMatch = html.match(/data-qa="vacancy-salary"[^>]*>([\s\S]*?)<\/span>/i);
  if (salaryMatch && salaryMatch[1]) {
    salary = salaryMatch[1].replace(/<[^>]+>/g, "").replace(/\u00a0/g, " ").trim();
  }

  // 3. Extract official Key Skills from data-qa="skills-element"
  const skillsMatches = html.match(/data-qa="skills-element"[^>]*>([\s\S]*?)<\/div>/gi) || [];
  const keySkills: string[] = skillsMatches
    .map((s) => s.replace(/<[^>]+>/g, "").replace(/\u00a0/g, " ").trim())
    .filter(Boolean);

  const cleanDescription = cleanHtmlDescription(descriptionHtml);

  return {
    position,
    company,
    location,
    salary,
    keySkills,
    description: cleanDescription,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawUrl: string = (body.url || body.link || "").trim();
    let vacancyId: string = (body.vacancyId || "").trim();

    if (!vacancyId && rawUrl) {
      const match = rawUrl.match(/vacancy\/(\d+)/i);
      if (match && match[1]) {
        vacancyId = match[1];
      }
    }

    if (!vacancyId) {
      return NextResponse.json(
        {
          error:
            "Не удалось определить ID вакансии. Пожалуйста, укажите ссылку формата https://hh.ru/vacancy/12345678",
        },
        { status: 400 }
      );
    }

    let position = "Специалист";
    let company = "Работодатель";
    let location = "РФ";
    let salaryText = "Не указана";
    let keySkillsList: string[] = [];
    let cleanDescription = "";

    // Step 1: Attempt official public API (api.hh.ru)
    let apiSuccess = false;
    try {
      const hhRes = await fetch(`https://api.hh.ru/vacancies/${vacancyId}`, {
        headers: {
          "User-Agent": "LaunchPadATS/1.0 (support@launchpad.pro)",
          Accept: "application/json",
        },
        next: { revalidate: 60 },
      });

      if (hhRes.ok) {
        const data = await hhRes.json();
        position = (data.name || "Специалист").trim();
        company = (data.employer?.name || "Работодатель").trim();
        location = (data.area?.name || "РФ").trim();
        salaryText = formatSalary(data.salary);

        keySkillsList = Array.isArray(data.key_skills)
          ? data.key_skills.map((s: { name: string }) => s.name.trim()).filter(Boolean)
          : [];

        cleanDescription = cleanHtmlDescription(data.description || "");
        apiSuccess = true;
      }
    } catch {
      apiSuccess = false;
    }

    // Step 2: Fallback to web scraping if API didn't succeed (e.g. 403 or captcha)
    if (!apiSuccess || !cleanDescription) {
      try {
        const webData = await scrapeHhVacancyWeb(vacancyId);
        position = webData.position || position;
        company = webData.company || company;
        location = webData.location || location;
        salaryText = webData.salary !== "Не указана" ? webData.salary : salaryText;
        keySkillsList = webData.keySkills.length > 0 ? webData.keySkills : keySkillsList;
        cleanDescription = webData.description || cleanDescription;
      } catch (err: any) {
        if (!apiSuccess) {
          return NextResponse.json(
            {
              error: `Не удалось загрузить данные вакансии #${vacancyId}. Проверьте, активна ли вакансия на hh.ru.`,
            },
            { status: 404 }
          );
        }
      }
    }

    // Format full structured vacancy text for ATS Scanner
    const skillsBlock =
      keySkillsList.length > 0
        ? `ОФИЦИАЛЬНЫЕ КЛЮЧЕВЫЕ НАВЫКИ ИЗ ФИЛЬТРА HR (HH.RU):\n${keySkillsList.join(", ")}\n\n`
        : "";

    const fullJobText = `ВАКАНСИЯ: ${position}
КОМПАНИЯ: ${company}
ЛОКАЦИЯ: ${location} | ЗАРПЛАТА: ${salaryText}
ССЫЛКА: https://hh.ru/vacancy/${vacancyId}

${skillsBlock}ОПИСАНИЕ И ТРЕБОВАНИЯ ВАКАНСИИ:
${cleanDescription}`;

    return NextResponse.json({
      success: true,
      vacancyId,
      position,
      company,
      location,
      salary: salaryText,
      keySkills: keySkillsList,
      description: cleanDescription,
      fullJobText,
    });
  } catch (error: any) {
    console.error("[HH Parse API Error]:", error);
    return NextResponse.json(
      { error: "Ошибка при подключении к сервису HeadHunter", details: error?.message },
      { status: 500 }
    );
  }
}
