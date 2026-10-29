/**
 * Follow-Up Templates Library & Dynamic Interpolation
 * 6 High-Converting Scenarios in Russian & English
 * Strictly clean of Markdown artifacts (**, ###)
 */

import { cleanAIMarkdownArtifacts } from "./monetization";

export interface FollowUpScenario {
  id: string;
  titleRu: string;
  titleEn: string;
  badgeRu: string;
  badgeEn: string;
  subjectRu: string;
  subjectEn: string;
  templateRu: string;
  templateEn: string;
}

export const FOLLOW_UP_SCENARIOS: FollowUpScenario[] = [
  {
    id: "sc-1-classic",
    titleRu: "Сценарий 1. Классический Follow-Up через 5-7 дней",
    titleEn: "Scenario 1. Classic 5-7 Days Follow-Up",
    badgeRu: "+34% к шансу на интервью",
    badgeEn: "+34% interview chance",
    subjectRu: "Уточнение статуса рассмотрения резюме: {Должность} в {Компания}",
    subjectEn: "Application status check: {Position} at {Company}",
    templateRu: `Здравствуйте, команда {Компания}!

Я направлял отклик на позицию {Должность} ровно неделю назад и хотел подтвердить свою высокую заинтересованность в работе над вашими продуктами.

Мой опыт сфокусирован на ключевых требованиях вашей роли — в частности, {Главный_подтвержденный_навык}. На предыдущих проектах моим главным результатом стало: {Главная_метрика_из_резюме}.

Буду признателен за краткую обратную связь: удалось ли нанимающему менеджеру ознакомиться с резюме и требуются ли какие-либо дополнительные материалы?

С уважением,
{Имя_соискателя}
{Телефон} | {Email}`,
    templateEn: `Dear {Company} Hiring Team,

I submitted my application for the {Position} position last week and wanted to reiterate my strong enthusiasm for joining your team.

My background aligns closely with your core requirements, particularly around {Top_Skill}. In my previous role, I delivered measurable business impact, notably: {Key_Metric}.

Could you kindly share an update on the hiring timeline and whether any further information is needed from my end?

Best regards,
{Candidate_Name}
{Phone} | {Email}`,
  },
  {
    id: "sc-2-hiring-manager",
    titleRu: "Сценарий 2. Пинг напрямую нанимающему тимлиду / Hiring Manager",
    titleEn: "Scenario 2. Direct Ping to Hiring Manager (Telegram / LinkedIn)",
    badgeRu: "Прямой контакт без очередей HR",
    badgeEn: "Direct reach out without HR queue",
    subjectRu: "Отклик на роль {Должность} в вашей команде ({Компания})",
    subjectEn: "Re: {Position} in your team at {Company}",
    templateRu: `Приветствую!

Пишу напрямую, так как знаю, насколько плотный график у нанимающих лидеров. Обратил внимание на открытую позицию {Должность} в вашей инженерной команде {Компания}.

У меня за плечами сильный трек в {Главный_подтвержденный_навык}. Один из свежих результатов: {Главная_метрика_из_резюме}. Уверен, что смогу с первой недели снять с вас рутину по архитектуре и ускорить деливери спринтов.

Резюме уже отправлено через форму, но буду рад ответить на пару вопросов в переписке, чтобы сэкономить ваше время.

С уважением,
{Имя_соискателя}
{Email}`,
    templateEn: `Hi there,

Reaching out directly as I know how busy engineering leaders are. I noticed the open {Position} role on your team at {Company} and wanted to introduce myself.

I have extensive hands-on expertise in {Top_Skill}. Recently, I achieved: {Key_Metric}. I am confident I can step in immediately and accelerate your team's delivery velocity.

My application is in the system, but I would welcome a brief 5-minute chat to discuss how I can help your team achieve its upcoming milestones.

Best regards,
{Candidate_Name}
{Email}`,
  },
  {
    id: "sc-3-after-tech",
    titleRu: "Сценарий 3. Follow-Up после технического интервью",
    titleEn: "Scenario 3. Post-Tech Interview Follow-Up",
    badgeRu: "Закрепление сильных сторон",
    badgeEn: "Solidifying technical strengths",
    subjectRu: "Благодарность за техническое интервью: {Должность} в {Компания}",
    subjectEn: "Thank you for the technical interview: {Position} at {Company}",
    templateRu: `Здравствуйте!

Большое спасибо за содержательное техническое собеседование и интересную дискуссию о масштабировании архитектуры {Компания}! Разбор кейсов ещё раз подтвердил, что задачи вашей команды идеально совпадают с моими компетенциями.

В продолжение нашего обсуждения {Главный_подтвержденный_навык}: ещё раз проанализировал вопрос отказоустойчивости и убедился, что аналогичный подход помог нам достичь {Главная_метрика_из_резюме}.

Буду с нетерпением ждать итогов секции и следующего этапа!

С наилучшими пожеланиями,
{Имя_соискателя}
{Телефон}`,
    templateEn: `Dear Interview Team,

Thank you for the insightful technical discussion today regarding architecture scalability at {Company}. The engineering challenges we discussed strongly resonated with my background.

Following up on our conversation about {Top_Skill}: I reflected further on the design constraints and believe the exact pattern we used to achieve {Key_Metric} will directly address your throughput targets.

Looking forward to hearing the feedback and discussing next steps!

Best regards,
{Candidate_Name}
{Phone}`,
  },
  {
    id: "sc-4-referral",
    titleRu: "Сценарий 4. Запрос рефералки у действующего сотрудника",
    titleEn: "Scenario 4. Employee Referral Request",
    badgeRu: "Канал с конверсией 67%",
    badgeEn: "67% conversion channel",
    subjectRu: "Вопрос о вакансии {Должность} в {Компания} / Рекомендация",
    subjectEn: "Quick question on {Position} at {Company} / Referral",
    templateRu: `Привет!

Увидел твой профиль и обратил внимание, что ты работаешь в {Компания}. Давно слежу за развитием ваших технологических продуктов и сейчас планирую откликнуться на вакансию {Должность}.

Мой стек и опыт отлично закрывают требования: глубоко практикую {Главный_подтвержденный_навык}, а из измеримых достижений — {Главная_метрика_из_резюме}.

Подскажи, готов ли ты закинуть моё резюме через внутреннюю реферальную программу компании? Буду очень признателен за содействие, а тебе будет начислен бонус за успешный наём!

Спасибо большое,
{Имя_соискателя}`,
    templateEn: `Hi!

Hope you are doing well. I came across your profile and noticed you are at {Company}. I have been following your team's engineering releases and am looking to apply for the {Position} opening.

My background is a direct match: specialized in {Top_Skill}, with proven achievements like: {Key_Metric}.

Would you be open to submitting my profile through your internal employee referral portal? Would truly appreciate the connection, and you'll be eligible for the referral bonus upon hire!

Thanks so much,
{Candidate_Name}`,
  },
  {
    id: "sc-5-counter-offer",
    titleRu: "Сценарий 5. Ответ на заниженный оффер / Торг по зарплате",
    titleEn: "Scenario 5. Salary Negotiation & Offer Counter",
    badgeRu: "Опора на цифры и достижения",
    badgeEn: "Grounded in quantified impact",
    subjectRu: "Оффер на позицию {Должность} в {Компания}: обсуждение условий",
    subjectEn: "Offer details for {Position} at {Company}: follow-up",
    templateRu: `Здравствуйте, команда {Компания}!

Огромное спасибо за предложение о работе на позиции {Должность}! Культура компании и масштабы предстоящих задач вызывают у меня искренний энтузиазм.

Внимательно изучив структуру компенсации, я хотел бы обсудить базовую ставку. Учитывая мою глубокую экспертизу в {Главный_подтвержденный_навык} и доказанный результат ({Главная_метрика_из_резюме}), я готов сразу взять на себя повышенную зону ответственности.

Сможем ли мы скорректировать фиксированную часть до рыночного уровня, чтобы мы с уверенностью зафиксировали соглашение?

Готов созвониться в удобное для вас время для краткого обсуждения.

С уважением,
{Имя_соискателя}`,
    templateEn: `Dear {Company} Hiring Team,

Thank you so much for extending the offer for the {Position} role! I am genuinely excited about the company vision and the team's roadmap.

After careful review of the overall package, I would love to discuss the base compensation component. Given my proven track record in {Top_Skill} and measurable accomplishments such as {Key_Metric}, I am prepared to take on immediate senior ownership.

Would there be flexibility to align the base salary closer to market benchmark to finalize our mutual agreement?

I welcome a quick call at your earliest convenience.

Best regards,
{Candidate_Name}`,
  },
  {
    id: "sc-6-reanimator",
    titleRu: "Сценарий 6. Вежливый реаниматор диалога (HR замолчал)",
    titleEn: "Scenario 6. Polite Dialogue Reanimator (Post-Screening Silence)",
    badgeRu: "Возврат в активную воронку",
    badgeEn: "Reactivating cold applications",
    subjectRu: "Продолжение диалога по вакансии {Должность} в {Компания}",
    subjectEn: "Following up: {Position} discussion at {Company}",
    templateRu: `Здравствуйте!

Надеюсь, у вас всё отлично! На прошлой неделе мы общались по поводу роли {Должность} в {Компания}, после чего я ожидал апдейт по согласованию с нанимающим руководителем.

Понимаю, что поиск кандидата — процесс интенсивный. Хотел подтвердить, что открыт к предложениям и вакансия остаётся для меня в топе приоритетов.

Подскажите, пожалуйста, продолжается ли отбор и есть ли новости по моему кандидату?

Хорошего дня,
{Имя_соискателя}`,
    templateEn: `Hi there,

Hope you are having a productive week! Following our screening discussion for the {Position} role at {Company}, I wanted to check in on the team's feedback.

I know how demanding hiring cycles can be. Just wanted to confirm that this role remains my top priority and I am enthusiastic about the opportunity.

Could you let me know if the team has reached a decision on next steps?

Have a wonderful week,
{Candidate_Name}`,
  },
];

/**
 * Interpolates variables from Job Application into template
 */
export function interpolateFollowUpTemplate(
  template: string,
  variables: {
    company: string;
    position: string;
    topSkill?: string;
    keyMetric?: string;
    candidateName: string;
    phone?: string;
    email?: string;
  }
): string {
  const comp = variables.company || "Компания";
  const pos = variables.position || "Специалист";
  const skill = variables.topSkill || "современный стек технологий и системный дизайн";
  const metric = variables.keyMetric || "сокращение времени отклика API на 35% и повышение надёжности";
  const name = variables.candidateName || "Соискатель";
  const phone = variables.phone || "+7 (999) 000-00-00";
  const email = variables.email || "candidate@email.ru";

  let result = template
    .replace(/\{Компания\}|\{Company\}/g, comp)
    .replace(/\{Должность\}|\{Position\}/g, pos)
    .replace(/\{Главный_подтвержденный_навык\}|\{Top_Skill\}/g, skill)
    .replace(/\{Главная_метрика_из_резюме\}|\{Key_Metric\}/g, metric)
    .replace(/\{Имя_соискателя\}|\{Candidate_Name\}/g, name)
    .replace(/\{Телефон\}|\{Phone\}/g, phone)
    .replace(/\{Email\}/g, email);

  return cleanAIMarkdownArtifacts(result);
}

/**
 * Generates an .ics Calendar Reminder set for +6 days from applied_at
 */
export function generateIcsCalendarFile(job: {
  company: string;
  position: string;
  applied_at?: string | null;
}): string {
  const baseDate = job.applied_at ? new Date(job.applied_at) : new Date();
  const reminderDate = new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000);
  reminderDate.setHours(11, 0, 0, 0);

  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const startStr = formatDate(reminderDate);
  const endStr = formatDate(new Date(reminderDate.getTime() + 30 * 60 * 1000));
  const nowStr = formatDate(new Date());

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//LaunchPad AI PRO//Job Search Follow-Up//RU
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@launchpad-app-ashy.vercel.app
DTSTAMP:${nowStr}
DTSTART:${startStr}
DTEND:${endStr}
SUMMARY:Follow-Up отклика: ${job.company} (${job.position})
DESCRIPTION:Пора отправить вежливый Follow-Up рекрутеру ${job.company}. По статистике, напоминание на 5-7 день увеличивает шанс на интервью на +34%.\\nГотовые шаблоны: https://launchpad-app-ashy.vercel.app/follow-ups
LOCATION:Online / Email
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Напоминание: пора отправить Follow-Up в ${job.company}
END:VALARM
END:VEVENT
END:VCALENDAR`;
}

/**
 * Generates direct Google Calendar web URL set for +5 days (Module 5)
 */
export function generateGoogleCalendarUrl(job: {
  company: string;
  position: string;
  applied_at?: string | null;
  messageText?: string;
}): string {
  const baseDate = job.applied_at ? new Date(job.applied_at) : new Date();
  const reminderDate = new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000);
  reminderDate.setHours(11, 0, 0, 0);

  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const startStr = formatDate(reminderDate);
  const endStr = formatDate(new Date(reminderDate.getTime() + 30 * 60 * 1000));

  const title = `Отправить Follow-Up в ${job.company} (${job.position})`;
  const details = job.messageText
    ? `Текст напоминания:\n\n${job.messageText}\n\nLaunchPad AI: https://launchpad-app-ashy.vercel.app/follow-ups`
    : `Пора вежливо напомнить о своем резюме на позицию ${job.position} в компании ${job.company}.\nШаблоны: https://launchpad-app-ashy.vercel.app/follow-ups`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startStr}/${endStr}`,
    details: details,
    location: job.company,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
