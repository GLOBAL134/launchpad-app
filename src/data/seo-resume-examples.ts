export interface SeoResumeExample {
  slug: string;
  roleRu: string;
  roleEn: string;
  level: string;
  salaryRangeRu: string;
  salaryRangeEn: string;
  demandBadge: string;
  metaDescriptionRu: string;
  metaDescriptionEn: string;
  beforeScore: number;
  afterScore: number;
  breakdown: {
    hardSkills: number;
    quantMetrics: number;
    softSkills: number;
    atsLayout: number;
  };
  flawsRu: string[];
  flawsEn: string[];
  improvementsRu: string[];
  improvementsEn: string[];
  targetSkills: string[];
  sampleJobSnippetRu: string;
  sampleJobSnippetEn: string;
  beforeResumeTextRu: string;
  beforeResumeTextEn: string;
  afterResumeTextRu: string;
  afterResumeTextEn: string;
}

export const SEO_RESUME_EXAMPLES: SeoResumeExample[] = [
  {
    slug: "backend-engineer",
    roleRu: "Senior / Middle Backend Разработчик (Go, Python, PostgreSQL)",
    roleEn: "Senior / Middle Backend Engineer (Go, Python, PostgreSQL)",
    level: "Middle+ / Senior",
    salaryRangeRu: "280 000 — 480 000 ₽ / месяц",
    salaryRangeEn: "$4,500 — $7,500 / month",
    demandBadge: "🔥 Топ-1 по объёму вакансий (85% ATS-фильтрация)",
    metaDescriptionRu: "Пример резюме Backend Developer с разбором до и после аудита ATS. Как повысить рейтинг резюме с 60% до 95% за счёт формулы XYZ и точных ключевых слов Go, PostgreSQL, Kafka.",
    metaDescriptionEn: "Backend Developer resume case study with ATS audit breakdown. Learn how to boost resume match from 60% to 95% using the XYZ formula and exact keywords for Go, PostgreSQL, Kafka.",
    beforeScore: 60,
    afterScore: 95,
    breakdown: {
      hardSkills: 53,
      quantMetrics: 14,
      softSkills: 14,
      atsLayout: 14,
    },
    flawsRu: [
      "Размытые глаголы обязанностей: «занимался разработкой сервисов», «писал SQL-запросы» вместо оцифрованных достижений.",
      "Отсутствие упоминаний протоколов и инструментов из требований: gRPC, Kafka, Docker, Kubernetes, Prometheus, Redis.",
      "Двухколоночный шаблон с иконками и цветными прогресс-барами, сбивающий парсеры Workday и Taleo."
    ],
    flawsEn: [
      "Vague responsibility verbs: 'worked on backend services', 'wrote SQL queries' without quantifiable metrics.",
      "Missing critical keywords from job specs: gRPC, Kafka, Docker, Kubernetes, Prometheus, Redis.",
      "Two-column Canva layout with graphics and progress bars breaking Workday and Taleo OCR."
    ],
    improvementsRu: [
      "Внедрена формула Google XYZ: [Достиг X] [измеренное Y] [с помощью Z] с точным указанием нагрузок (RPS, миллисекунды задержки).",
      "100% цитирование обязательного стека в разделе навыков и контексте проектов: Go, PostgreSQL, Kafka, gRPC, Docker, Kubernetes.",
      "Переход на строгий одноколоночный гарвардский ATS-стандарт — 100% точность парсинга всеми корпоративными системами."
    ],
    improvementsEn: [
      "Implemented Google XYZ formula: [Accomplished X] [measured by Y] [by doing Z] specifying latency ms and RPS throughput.",
      "100% verified hard skill coverage: Go, PostgreSQL, Kafka, gRPC, Docker, Kubernetes in project context.",
      "Converted to single-column Harvard ATS standard for 100% machine readability."
    ],
    targetSkills: ["Go (Golang)", "PostgreSQL", "Kafka", "gRPC", "Docker", "Kubernetes", "Redis", "Highload", "Prometheus", "CI/CD"],
    sampleJobSnippetRu: "Требования: Опыт коммерческой разработки на Go от 3 лет. Глубокое понимание PostgreSQL (оптимизация индексов, транзакции, шардирование). Опыт работы с брокерами сообщений (Apache Kafka или RabbitMQ). Понимание микросервисной архитектуры, gRPC, Docker, Kubernetes. Умение профилировать код под высокие нагрузки (10k+ RPS).",
    sampleJobSnippetEn: "Requirements: 3+ years commercial Go engineering. Deep PostgreSQL knowledge (index optimization, transactions, partitioning). Hands-on experience with Kafka or RabbitMQ. Microservices architecture, gRPC, Docker, Kubernetes. Experience profiling high-throughput services (10k+ RPS).",
    beforeResumeTextRu: `Иван Смирнов — Backend Разработчик
Email: ivan.smirnov@example.com | Telegram: @ivan_smirnov | Москва

О себе:
Увлеченный бэкенд разработчик с опытом 4 года. Люблю писать чистый код и изучать новые технологии. Работал в различных проектах.

Опыт работы:
Финтех Компания (2022 — по наст. время)
Backend Developer
— Разрабатывал бэкенд для платежного сервиса
— Писал запросы к базе данных и исправлял баги
— Участвовал в командных митингах и код-ревью
— Писал документацию для API

Веб-Студия (2020 — 2022)
Junior / Middle Developer
— Создавал сайты и интеграции для клиентов
— Настраивал серверы и базы данных
— Решал инциденты на проде

Навыки:
Go, Python, SQL, Git, Linux`,
    beforeResumeTextEn: `Ivan Smirnov — Backend Engineer
Email: ivan.smirnov@example.com | Telegram: @ivan_smirnov | Remote

About:
Passionate backend engineer with 4 years of experience. Enjoy writing clean code and learning new tech.

Work Experience:
Fintech Company (2022 — Present)
Backend Engineer
— Developed backend for payment service
— Wrote database queries and fixed bugs
— Participated in standups and code reviews
— Documented APIs

Web Studio (2020 — 2022)
Junior / Middle Developer
— Built websites and client integrations
— Configured servers and databases
— Handled production incidents

Skills:
Go, Python, SQL, Git, Linux`,
    afterResumeTextRu: `Иван Смирнов
Senior Backend Engineer (Go / PostgreSQL / Highload)
Москва | +7 (999) 000-00-00 | ivan.smirnov@example.com | github.com/ivansmirnov | t.me/ivan_go

ПРОФЕССИОНАЛЬНЫЙ ПРОФИЛЬ
Инженер серверной разработки с 4+ годами опыта проектирования высоконагруженных микросервисов на Go и Python. Специализация: отказоустойчивые распределенные транзакции, брокеры Kafka, оптимизация PostgreSQL под нагрузку свыше 15 000 RPS. Опыт сокращения задержек API на 42% и успешного прохождения аудита отказоустойчивости 99.99%.

КЛЮЧЕВЫЕ ТЕХНИЧЕСКИЕ НАВЫКИ
— Языки и платформы: Go (Golang), Python (FastAPI), Bash, C-extensions
— Базы данных и хранилища: PostgreSQL (B-Tree/GiST индексы, EXPLAIN ANALYZE, pg_partman), Redis, ClickHouse
— Брокеры и протоколы: Apache Kafka (Event Sourcing, Idempotent Producer), gRPC (Protobuf), REST API, WebSockets
— Инфраструктура и мониторинг: Docker, Kubernetes (Helm, K8s manifests), Prometheus, Grafana, OpenTelemetry, CI/CD (GitLab, GitHub Actions)

ПРОФЕССИОНАЛЬНЫЙ ОПЫТ

АО «Финтех Системы» (Платежный шлюз) — Москва
Senior Backend Engineer | 2022 — настоящее время
— Спроектировал и развернул ядро биллингового микросервиса на Go и gRPC, обеспечив обработку 14 500 RPS с P99 латентностью менее 38 мс.
— Оптимизировал схему и индексацию PostgreSQL для таблиц транзакций объемом 1.8 TB, снизив среднее время выполнения критических финансовых отчетов с 4.2 секунд до 140 миллисекунд (ускорение в 30 раз).
— Реализовал распределенную обработку очереди платежей на базе Apache Kafka и паттерна Outbox, исключив потерю данных и снизив процент дублирующих списаний до 0.00%.
— Сократил время сборки и прогона интеграционных тестов в GitLab CI/CD на 58% за счет кэширования Go-модулей и параллелизации контейнеров.

Веб-Платформы Инноваций — Москва
Middle Backend Developer | 2020 — 2022
— Разработал с нуля 6 микросервисов аутентификации и нотификаций на Go и Redis, обслуживающих базу из 850 000 активных пользователей.
— Интегрировал мониторинг на базе Prometheus и Grafana, что позволило автоматизировать обнаружение узких мест и снизить MTTR (время устранения сбоев) с 45 до 7 минут.

ОБРАЗОВАНИЕ И СЕРТИФИКАЦИИ
— МГТУ им. Н.Э. Баумана, Бакалавр «Информатика и вычислительная техника», 2020
— Certified Kubernetes Application Developer (CKAD), Linux Foundation`,
    afterResumeTextEn: `Ivan Smirnov
Senior Backend Engineer (Go / PostgreSQL / Highload)
Remote / Relocation | +7 (999) 000-00-00 | ivan.smirnov@example.com | github.com/ivansmirnov | linkedin.com/in/ivansmirnov

PROFESSIONAL SUMMARY
Backend Software Engineer with 4+ years of experience designing fault-tolerant distributed systems and microservices in Go and Python. Expertise in high-throughput transactional architectures, Kafka event streams, and PostgreSQL performance tuning for 15,000+ RPS workloads. Proven track record of cutting API P99 latency by 42% while upholding 99.99% uptime.

TECHNICAL SKILLS
— Languages: Go (Golang), Python (FastAPI), Bash
— Databases & Storage: PostgreSQL (EXPLAIN ANALYZE, indexing, partitioning), Redis, ClickHouse
— Streaming & Protocols: Apache Kafka (Event Sourcing, Outbox pattern), gRPC (Protobuf), REST, WebSockets
— Cloud & DevOps: Docker, Kubernetes, Helm, CI/CD (GitHub Actions, GitLab), Prometheus, Grafana, OpenTelemetry

WORK EXPERIENCE

Fintech Global Gateway — Remote
Senior Backend Engineer | 2022 — Present
— Architected core billing and checkout microservices in Go & gRPC, handling 14,500 RPS with P99 latency under 38ms.
— Tuned PostgreSQL schema and query execution plans across 1.8 TB dataset, reducing analytical query duration from 4.2s to 140ms.
— Built reliable transactional event pipeline using Apache Kafka and Outbox pattern, eliminating message loss and cutting duplicate retries to 0.00%.
— Accelerated CI/CD delivery pipeline by 58% through optimized multi-stage Docker caching and parallelized test runner.

Web Platform Innovations — Remote
Middle Backend Developer | 2020 — 2022
— Developed 6 microservices for auth and push notifications using Go and Redis, supporting 850,000 active mobile users.
— Integrated Prometheus metrics and Grafana alerts, reducing MTTR from 45 minutes to 7 minutes.

EDUCATION & CERTIFICATIONS
— Bauman Moscow State Technical University, B.S. in Computer Science, 2020
— Certified Kubernetes Application Developer (CKAD), Linux Foundation`
  },
  {
    slug: "frontend-engineer",
    roleRu: "Senior / Middle Frontend Разработчик (React, TypeScript, Next.js)",
    roleEn: "Senior / Middle Frontend Engineer (React, TypeScript, Next.js)",
    level: "Middle+ / Senior",
    salaryRangeRu: "240 000 — 420 000 ₽ / месяц",
    salaryRangeEn: "$4,000 — $7,000 / month",
    demandBadge: "⚡ 78% вакансий требуют Next.js и оптимизацию Web Vitals",
    metaDescriptionRu: "Пример резюме Frontend Developer с оптимизацией под ATS. До и после аудита: как поднять оценку до 94% с помощью оцифровки Web Vitals, TypeScript, React и Next.js.",
    metaDescriptionEn: "Frontend Developer resume case study with ATS optimization. Before and after audit: boost match score to 94% with Web Vitals metrics, TypeScript, React, and Next.js.",
    beforeScore: 58,
    afterScore: 94,
    breakdown: {
      hardSkills: 52,
      quantMetrics: 14,
      softSkills: 14,
      atsLayout: 14,
    },
    flawsRu: [
      "Фокус на интерфейсной вёрстке («верстал лендинги», «делал адаптив») вместо архитектуры приложений и оптимизации производительности.",
      "Отсутствие метрик Core Web Vitals (LCP, FID, CLS) и цифр сокращения бандла.",
      "Использование графического шаблона с диаграммами уровня владения JS/HTML, не распознаваемыми ATS."
    ],
    flawsEn: [
      "Focus on basic slicing ('created UI pages', 'made responsive layouts') instead of frontend architecture and performance metrics.",
      "Zero mention of Core Web Vitals (LCP, FID, CLS) or bundle size reductions.",
      "Skill rating bars and multi-column graphics completely dropped by ATS parser."
    ],
    improvementsRu: [
      "Оцифровка достижений: ускорение LCP на 1.4с, сокращение бандла на 38%, рост конверсии мобильных пользователей на 22%.",
      "Полный охват современных стандартов: React 19, TypeScript strict mode, Next.js App Router, SSR/SSG, Zustand, Tailwind CSS, Jest/Playwright.",
      "Чистый гарвардский стандарт оформления с четкой иерархией заголовков H1/H2."
    ],
    improvementsEn: [
      "Quantified impact: improved LCP by 1.4s, reduced JS bundle size by 38%, increased mobile conversion by 22%.",
      "Full coverage of modern requirements: React, TypeScript strict mode, Next.js App Router, Zustand, Tailwind CSS, Playwright.",
      "Clean single-column layout parsing smoothly into Taleo, Greenhouse, and Workday."
    ],
    targetSkills: ["React", "TypeScript", "Next.js", "Core Web Vitals", "Zustand / Redux Toolkit", "Tailwind CSS", "Playwright", "Webpack / Vite", "REST / GraphQL", "SSR / ISR"],
    sampleJobSnippetRu: "Требования: Опыт коммерческой разработки на React и TypeScript от 3 лет. Глубокое понимание Next.js (App Router, Server Components). Опыт оптимизации Core Web Vitals и профилирования рендеринга. Уверенное владение стейт-менеджерами (Zustand, RTK). Написание автотестов (Jest, React Testing Library, Playwright).",
    sampleJobSnippetEn: "Requirements: 3+ years in commercial React & TypeScript. Strong Next.js experience (App Router, Server Components). Deep understanding of Core Web Vitals and render profiling. State management (Zustand or Redux Toolkit). Testing with Jest, RTL, Playwright.",
    beforeResumeTextRu: `Анна Васильева — Frontend Разработчик
Email: anna.frontend@example.com | Санкт-Петербург

Обо мне:
Фронтенд разработчик с опытом 3 года. Люблю красивый дизайн и современные технологии. Пишу на React и верстаю адаптивные сайты.

Опыт:
Агентство Диджитал (2022 — по н.в.)
Frontend Developer
— Верстала макеты из Figma
— Писала компоненты на React и TypeScript
— Настраивала работу со стейтом
— Исправляла ошибки в стилях

Стартап Лаб (2021 — 2022)
Junior Frontend
— Разрабатывала страницы веб-сервиса
— Подключала API бэкенда
— Делала адаптивную версию под мобильные устройства

Навыки:
HTML, CSS, JavaScript, React, Git`,
    beforeResumeTextEn: `Anna Vasilyeva — Frontend Developer
Email: anna.frontend@example.com | Remote

Summary:
Frontend developer with 3 years experience. Passionate about clean UI and modern tech. Building responsive websites with React.

Work:
Digital Agency (2022 — Present)
Frontend Developer
— Coded designs from Figma
— Built components with React & TypeScript
— Managed app state
— Fixed styling bugs

Startup Lab (2021 — 2022)
Junior Frontend
— Built web app pages
— Connected backend APIs
— Optimized responsive layouts

Skills:
HTML, CSS, JavaScript, React, Git`,
    afterResumeTextRu: `Анна Васильева
Senior Frontend Engineer (React / TypeScript / Next.js)
Санкт-Петербург | +7 (999) 111-22-33 | anna.vasilyeva@example.com | github.com/annavas | linkedin.com/in/annavas

ПРОФЕССИОНАЛЬНЫЙ ПРОФИЛЬ
Инженер пользовательских интерфейсов с 4+ годами опыта создания высоконагруженных веб-приложений на React, TypeScript и Next.js. Специализация на оптимизации Core Web Vitals (LCP < 1.2s), микрофронтендах и масштабируемых дизайн-системах. Опыт снижения размера JS-бандла на 38% и повышения конверсии продукта на 18%.

КЛЮЧЕВЫЕ ТЕХНИЧЕСКИЕ НАВЫКИ
— Технологии: React 19, TypeScript (Strict Mode), Next.js (App Router, RSC, ISR), JavaScript (ESNext)
— Управление состоянием: Zustand, TanStack Query (React Query), Redux Toolkit
— Стилизация и дизайн-системы: Tailwind CSS, Radix UI, Storybook, CSS Modules
— Сборка и качество кода: Vite, Webpack, ESLint, Prettier, Jest, React Testing Library, Playwright (E2E)
— Архитектура и оптимизация: Core Web Vitals, Code Splitting, Dynamic Imports, Web Workers, REST, GraphQL

ПРОФЕССИОНАЛЬНЫЙ ОПЫТ

Финтех Сервис «Орион» — Санкт-Петербург
Senior Frontend Engineer | 2022 — настоящее время
— Руководила миграцией личного кабинета 300 000+ пользователей на Next.js App Router и React Server Components, сократив время загрузки первой страницы (LCP) с 3.4с до 1.1с (на 68%).
— Спроектировала архитектуру глобального кэширования с использованием TanStack Query и Zustand, что снизило количество избыточных сетевых запросов к API на 44%.
— Разработала библиотеку доступных UI-компонентов на базе Radix UI и Tailwind CSS в Storybook, ускорив вывод новых продуктовых фичей командами на 35%.
— Настроила пайплайн автоматического тестирования с 85+ сценариями Playwright E2E и 200+ unit-тестами Jest, снизив количество багов на проде на 70%.

Диджитал Продакшн «Стрим» — Санкт-Петербург
Middle Frontend Developer | 2021 — 2022
— Разработала интерактивный аналитический дэшборд с графиками реального времени на Recharts и WebSockets для 40+ корпоративных клиентов.
— Оптимизировала размер клиентского JS-бандла с 2.8 MB до 1.2 MB (-57%) за счет древотряски (tree shaking) и динамических импортов.

ОБРАЗОВАНИЕ
— Университет ИТМО, Бакалавр прикладной информатики, 2021`,
    afterResumeTextEn: `Anna Vasilyeva
Senior Frontend Engineer (React / TypeScript / Next.js)
Remote | +7 (999) 111-22-33 | anna.vasilyeva@example.com | github.com/annavas | linkedin.com/in/annavas

PROFESSIONAL SUMMARY
Senior Frontend Engineer with 4+ years of expertise architecting high-performance web applications using React, TypeScript, and Next.js. Specializes in Core Web Vitals optimization (LCP < 1.2s), enterprise UI libraries, and data fetching pipelines. Track record of cutting bundle sizes by 57% and boosting conversion by 18%.

TECHNICAL SKILLS
— Core: React 19, TypeScript, Next.js (App Router, Server Components), JavaScript ESNext
— State & Networking: Zustand, TanStack Query, Redux Toolkit, REST, GraphQL
— Styling & UI: Tailwind CSS, Radix UI, Storybook, CSS Modules
— Tooling & Testing: Vite, Webpack, Playwright (E2E), Jest, React Testing Library, CI/CD
— Performance: Core Web Vitals (LCP, CLS, FID), Code Splitting, Bundle Profiling

WORK EXPERIENCE

Fintech Platform Orion — Remote
Senior Frontend Engineer | 2022 — Present
— Led migration of 300k+ MAU web app to Next.js App Router and Server Components, cutting LCP from 3.4s to 1.1s (-68%).
— Designed robust data-fetching architecture using TanStack Query & Zustand, reducing redundant network requests by 44%.
— Architected reusable accessible design system on Radix UI and Tailwind in Storybook, accelerating feature delivery velocity across 4 squads by 35%.
— Introduced automated Playwright E2E testing suite in GitHub Actions, reducing customer-reported bugs by 70%.

Stream Digital Production — Remote
Middle Frontend Developer | 2021 — 2022
— Built interactive real-time analytics dashboard with Recharts and WebSockets serving 40+ enterprise accounts.
— Reduced production JS bundle size from 2.8 MB to 1.2 MB (-57%) via code splitting, route-based lazy loading, and SVG optimization.

EDUCATION
— ITMO University, B.S. in Applied Informatics, 2021`
  },
  {
    slug: "qa-automation",
    roleRu: "QA Automation Engineer (Python, Playwright, CI/CD)",
    roleEn: "QA Automation Engineer (Python, Playwright, CI/CD)",
    level: "Middle+ / Senior",
    salaryRangeRu: "200 000 — 360 000 ₽ / месяц",
    salaryRangeEn: "$3,500 — $6,000 / month",
    demandBadge: "🎯 82% компаний требуют автоматизацию UI + API в CI/CD",
    metaDescriptionRu: "Пример резюме QA Automation Engineer с оценкой 95% в ATS. Полный разбор ошибок: от ручного тестирования к оцифрованным автотестам на Python, Playwright и Allure.",
    metaDescriptionEn: "QA Automation Engineer ATS resume case study scoring 95%. Detailed transition from manual testing bullets to quantified automated test suites in Python, Playwright, and Allure.",
    beforeScore: 61,
    afterScore: 95,
    breakdown: {
      hardSkills: 53,
      quantMetrics: 14,
      softSkills: 14,
      atsLayout: 14,
    },
    flawsRu: [
      "Упор на ручные шаги («писал тест-кейсы в Jira», «тестировал вручную») без фокуса на автоматизацию и стабильность пайплайна.",
      "Отсутствие метрик покрытия кода (Test Coverage %) и времени выполнения регрессионного прогона.",
      "Нет упоминания архитектурных паттернов автоматизации (Page Object Model, Fixtures, Mocking)."
    ],
    flawsEn: [
      "Overemphasis on manual testing ('created test cases in Jira', 'conducted manual smoke testing') without automation metrics.",
      "Zero stats on automated test coverage % or regression test execution time savings.",
      "Missing automation design patterns (Page Object Model, Pytest fixtures, API mocking)."
    ],
    improvementsRu: [
      "Оцифрованные результаты: сокращение времени регрессионного тестирования с 18 часов до 35 минут (-97%), покрытие API тестами на 92%.",
      "Точное соответствие ключевым навыкам: Python, Pytest, Playwright, Allure, Docker, GitLab CI/CD, Postman, SQL.",
      "Внедрение паттернов Page Object, Fixtures и параллельного прогона тестов в контейнерах."
    ],
    improvementsEn: [
      "Quantified impact: cut full regression cycle from 18 hours to 35 minutes (-97%), achieved 92% API coverage.",
      "Keyword alignment: Python, Pytest, Playwright, Allure, Docker, GitLab CI/CD, Postman, SQL.",
      "Showcased Page Object pattern, scalable fixtures, and parallel execution in Docker."
    ],
    targetSkills: ["Python", "Playwright", "Pytest", "Allure Report", "API Testing", "Docker", "GitLab CI/CD", "PostgreSQL", "Page Object Model", "Load Testing (k6)"],
    sampleJobSnippetRu: "Требования: Опыт автоматизации тестирования на Python от 2.5 лет. Уверенное владение Playwright или Selenium, Pytest. Опыт автоматизации API (Requests, REST). Интеграция автотестов в CI/CD (GitLab CI, GitHub Actions), формирование Allure-отчетов. Опыт работы с Docker и SQL.",
    sampleJobSnippetEn: "Requirements: 2.5+ years of test automation in Python. Strong Pytest and Playwright or Selenium. Automated API testing (Requests, REST). CI/CD integration (GitLab, GitHub Actions), Allure reports. Docker and SQL proficiency.",
    beforeResumeTextRu: `Сергей Новиков — Тестировщик ПО / QA
Email: sergey.qa@example.com | Москва

Опыт:
IT Компания (2022 — по н.в.)
QA Инженер
— Проводил ручное тестирование веб-сайта
— Составлял тест-планы и чек-листы
— Заводил баги в Jira
— Немного писал автотесты на Python

Сервис Плюс (2021 — 2022)
Младший тестировщик
— Тестировал формы и кнопки
— Проверял мобильную версию
— Общался с разработчиками

Навыки:
Jira, Confluence, Postman, Python, SQL, Ручное тестирование`,
    beforeResumeTextEn: `Sergey Novikov — QA Tester
Email: sergey.qa@example.com | Remote

Work Experience:
IT Company (2022 — Present)
QA Engineer
— Performed manual testing of web app
— Created test cases and check lists
— Logged bugs in Jira
— Wrote some Python scripts

Service Plus (2021 — 2022)
Junior QA Tester
— Tested forms and buttons
— Checked mobile responsiveness
— Communicated with developers

Skills:
Jira, Confluence, Postman, Python, SQL, Manual Testing`,
    afterResumeTextRu: `Сергей Новиков
Lead / Senior QA Automation Engineer (Python / Playwright / CI/CD)
Москва | +7 (999) 222-33-44 | sergey.novikov.qa@example.com | github.com/sergeynovikov-qa

ПРОФЕССИОНАЛЬНЫЙ ПРОФИЛЬ
Инженер по автоматизации тестирования с 4+ годами опыта создания надежных тестовых фреймворков для сложных веб-платформ и микросервисов. Экспертиза в Python, Pytest, Playwright, Allure и интеграции в CI/CD пайплайны. Опыт сокращения времени регрессионного прогона с 18 часов до 35 минут и предотвращения 99% блокирующих багов до релиза в продакшн.

КЛЮЧЕВЫЕ ТЕХНИЧЕСКИЕ НАВЫКИ
— Автоматизация UI и API: Python, Playwright, Pytest, Requests, Pydantic, Page Object Model
— Отчетность и мониторинг: Allure Report, Grafana, Telegram Webhook Alerts
— CI/CD и контейнеризация: Docker, GitLab CI/CD, GitHub Actions, Docker Compose
— Тестирование API и БД: REST API, Postman, Swagger/OpenAPI, PostgreSQL (сложные SELECT, JOIN, валидация данных)
— Нагрузочное тестирование: k6, Locust

ПРОФЕССИОНАЛЬНЫЙ ОПЫТ

Финтех Экосистема «Спектр» — Москва
Senior QA Automation Engineer | 2022 — настоящее время
— С нуля спроектировал и внедрил модульный фреймворк автоматизации на Python + Playwright + Pytest с архитектурой Page Object и изолированными фикстурами.
— Автоматизировал 450+ UI-сценариев и 780+ API-эндпоинтов, увеличив суммарное тестовое покрытие критических бизнес-процессов с 28% до 94%.
— Настроил параллельный запуск тестов в 8 потоков внутри Docker-контейнеров в GitLab CI/CD, что сократило время прогона полного регрессионного цикла с 18 часов ручной работы до 35 минут автоматического выполнения.
— Организовал автоматическую генерацию Allure-отчетов с видеозаписями падений и отправкой алертов в корпоративный Telegram-канал дежурных инженеров.

Платформа Электронной Коммерции — Москва
Middle QA Automation Engineer | 2021 — 2022
— Автоматизировал регрессионное тестирование платежного шлюза и корзины, обнаружив 34 критических бага до релиза на прод.
— Разработал набор тестов на базе k6, позволивший выявить узкие места производительности до запуска сезона распродаж (выдерживание 5 000 RPS).

ОБРАЗОВАНИЕ
— Московский технологический университет (МИРЭА), Бакалавр «Информационные системы и технологии», 2021`,
    afterResumeTextEn: `Sergey Novikov
Senior QA Automation Engineer (Python / Playwright / CI/CD)
Remote | +7 (999) 222-33-44 | sergey.novikov.qa@example.com | github.com/sergeynovikov-qa

PROFESSIONAL SUMMARY
QA Automation Engineer with 4+ years designing robust end-to-end automation frameworks for distributed cloud systems. Expert in Python, Pytest, Playwright, and GitLab CI/CD orchestration. Proven track record of slashing full regression duration from 18 hours down to 35 minutes while maintaining 94% test coverage.

TECHNICAL SKILLS
— Automation: Python, Playwright, Pytest, Requests, Pydantic, Page Object Model
— Test Reporting: Allure Framework, Grafana, Slack/Telegram Webhooks
— CI/CD & Infra: Docker, GitLab CI, GitHub Actions, Linux Shell, Docker Compose
— Protocols & DBs: REST API, Swagger/OpenAPI, PostgreSQL, Postman, JSON Schema
— Performance: k6, Locust load generation

WORK EXPERIENCE

Spectr Fintech Ecosystem — Remote
Senior QA Automation Engineer | 2022 — Present
— Architected custom test automation framework on Python, Playwright, and Pytest from scratch using Page Object Model and parallel fixtures.
— Automated 450+ UI flows and 780+ REST API endpoints, expanding test coverage across core checkout journey from 28% to 94%.
— Containerized test suites in Docker within GitLab CI/CD pipeline, reducing full regression testing turnaround time from 18 hours to 35 minutes (-97%).
— Automated daily Allure visual reports with trace recordings and instant error notifications.

E-Commerce Solutions — Remote
Middle QA Engineer | 2021 — 2022
— Built comprehensive API test harness using Python Requests validating order lifecycle and payment settlement.
— Conducted k6 load test simulations to certify infrastructure stability under 5,000 peak concurrent checkout operations.

EDUCATION
— MIREA Russian Technological University, B.S. in Information Systems, 2021`
  },
  {
    slug: "product-manager",
    roleRu: "Senior Product Manager (B2B SaaS, Unit Economics, AI)",
    roleEn: "Senior Product Manager (B2B SaaS, Unit Economics, AI)",
    level: "Senior / Lead",
    salaryRangeRu: "300 000 — 550 000 ₽ / месяц",
    salaryRangeEn: "$5,000 — $9,000 / month",
    demandBadge: "🚀 Рост спроса на продактов с оцифровкой P&L и метрик",
    metaDescriptionRu: "Пример резюме Product Manager с рейтингом ATS 96%. Как оцифровать влияние на выручку (ARR), конверсию, LTV/CAC и удержание клиентов в резюме для международных и РФ компаний.",
    metaDescriptionEn: "Product Manager ATS resume case study scoring 96%. Learn how to highlight ARR revenue growth, retention, LTV/CAC, and unit economics for top tech companies.",
    beforeScore: 59,
    afterScore: 96,
    breakdown: {
      hardSkills: 54,
      quantMetrics: 14,
      softSkills: 14,
      atsLayout: 14,
    },
    flawsRu: [
      "Фокус на процессах вместо бизнес-результата («проводил спринты», «общался со стейкхолдерами», «писал ТЗ»).",
      "Полное отсутствие финансовых метрик (ARR, MRR, ARPU, LTV, CAC, Retention).",
      "Не упомянуты современные инструменты продуктовой аналитики (Amplitude, SQL, Mixpanel, A/B тесты)."
    ],
    flawsEn: [
      "Process focus instead of business outcomes ('conducted sprint rituals', 'talked to stakeholders', 'wrote product specs').",
      "Zero financial or unit economics metrics (ARR, MRR, ARPU, LTV, CAC, Retention).",
      "Missing modern product analytics tooling (Amplitude, SQL, Mixpanel, statistical A/B experimentation)."
    ],
    improvementsRu: [
      "Четкая демонстрация влияния на P&L: рост ARR на +42 млн ₽, увеличение конверсии онбординга с 14% до 29%, снижение Churn на 3.2%.",
      "Указание методологий и инструментов: CustDev, Amplitude, SQL, A/B гипотезы с p-value < 0.05, JTBD, OKR, Roadmap.",
      "Гарвардская структура резюме с выделенными блоками продуктовых побед."
    ],
    improvementsEn: [
      "Quantified P&L metrics: grew ARR by $1.2M, boosted onboarding activation from 14% to 29%, reduced churn by 3.2%.",
      "Full stack of PM methodologies: CustDev, Amplitude, SQL, statistical A/B testing (p < 0.05), JTBD, OKRs.",
      "Strict single-column Harvard formatting highlighting strategic leadership."
    ],
    targetSkills: ["Unit Economics (LTV, CAC)", "Product Analytics (Amplitude, Mixpanel)", "SQL", "A/B Testing", "CustDev", "JTBD", "Product Strategy", "B2B SaaS", "Roadmapping", "OKR"],
    sampleJobSnippetRu: "Требования: Опыт управления IT-продуктами от 4 лет в B2B или B2C. Глубокое понимание юнит-экономики и продуктовой аналитики (Amplitude, SQL). Опыт проверки гипотез через A/B тестирование и CustDev. Умение формировать стратегию продукта, выстраивать Roadmap и управлять кросс-функциональной командой (10+ человек).",
    sampleJobSnippetEn: "Requirements: 4+ years of product management experience in B2B or B2C SaaS. Strong grasp of unit economics and analytical tools (Amplitude, SQL). Proven A/B hypothesis validation and CustDev. Strategic roadmapping and cross-functional team leadership (10+ members).",
    beforeResumeTextRu: `Максим Григорьев — Продакт Менеджер
Email: maxim.pm@example.com | Москва

Обо мне:
Опытный менеджер продукта. Люблю запускать полезные сервисы и работать в дружной команде разработчиков.

Опыт:
ИТ Платформа (2022 — по н.в.)
Product Manager
— Управлял бэклогом задач в Jira
— Проводил дейли, ретро и планирования
— Собирал требования от руководства
— Описывал фичи для дизайнеров и разработчиков

Диджитал Агентство (2020 — 2022)
Project / Product Manager
— Вел проекты клиентов
— Следил за дедлайнами и бюджетом
— Запускал сайты и приложения

Навыки:
Jira, Confluence, Управление проектами, Коммуникация, Презентации`,
    beforeResumeTextEn: `Maxim Grigoryev — Product Manager
Email: maxim.pm@example.com | Remote

Summary:
Experienced product manager who enjoys building user-friendly products and collaborating with agile engineering teams.

Work:
IT Platform (2022 — Present)
Product Manager
— Managed product backlog in Jira
— Conducted standups, sprint planning, and retrospectives
— Gathered requirements from management
— Wrote feature specs for designers and devs

Digital Agency (2020 — 2022)
Project / Product Manager
— Managed client projects and budgets
— Monitored team deadlines
— Launched web and mobile apps

Skills:
Jira, Confluence, Project Management, Agile, Communication`,
    afterResumeTextRu: `Максим Григорьев
Senior Product Manager (B2B SaaS / Growth / Unit Economics)
Москва | +7 (999) 333-44-55 | maxim.grigoryev.pm@example.com | linkedin.com/in/maxim-grigoryev

ПРОФЕССИОНАЛЬНЫЙ ПРОФИЛЬ
Senior Product Manager с 5+ годами опыта масштабирования B2B/B2C SaaS продуктов от стадии Product-Market Fit до десятков миллионов рублей ARR. Экспертиза в юнит-экономике (LTV/CAC > 3.8), продуктовой аналитике (Amplitude, SQL, Tableau) и валидации гипотез на базе A/B экспериментов. Вырастил выручку ключевого направления на +120% за 18 месяцев.

КЛЮЧЕВЫЕ ТЕХНИЧЕСКИЕ И ПРОДУКТОВЫЕ НАВЫКИ
— Аналитика данных и метрики: SQL (PostgreSQL, ClickHouse), Amplitude, Mixpanel, Tableau, Google Analytics 4
— Исследования и гипотезы: CustDev (120+ глубинных интервью), JTBD, A/B тестирование (статзначимость, p-value), CJM
— Бизнес и экономика: Unit Economics, LTV, CAC, Churn, Payback Period, P&L моделирование, ценообразование
— Процессы и лидерство: Управление кросс-функциональной командой из 14 инженеров, дизайнеров и QA; Scrum/Kanban, OKR

ПРОФЕССИОНАЛЬНЫЙ ОПЫТ

B2B Cloud Платформа «ДатаСфера» — Москва
Senior Product Manager | 2022 — настоящее время
— Возглавил кросс-функциональную команду из 12 специалистов (Backend, Frontend, ML, Design, QA), увеличив ARR направления с 38 млн ₽ до 84 млн ₽ (+121%) за счет запуска корпоративного тарифного плана.
— Перепроектировал воронку первого пользовательского опыта (Activation Flow), подняв конверсию из бесплатной регистрации в оплату подписки с 8.4% до 17.1% (рост выручки на 1.6 млн ₽ в месяц).
— Провел 65+ глубинных интервью с руководителями ИТ-департаментов (CustDev), выявил 3 ключевые боли безопасности и внедрил модуль Single Sign-On (SSO / SAML), закрывший 14 крупных enterprise-сделок.
— Разработал и внедрил систему продуктовых дашбордов в Amplitude и Tableau на базе прямых SQL-запросов к ClickHouse, сократив время принятия решений командой с 2 недель до 2 дней.

SaaS Стартап «ОмниЧат» — Москва
Product Manager (Growth & Retention) | 2020 — 2022
— Провёл 32 A/B эксперимента в модуле автоматизации рассылок, добившись снижения оттока клиентов (Monthly Churn) с 5.8% до 2.6%.
— Оптимизировал стоимость привлечения клиента (CAC) на 28% путем внедрения встроенной реферальной механики и виральных виджетов.

ОБРАЗОВАНИЕ
— НИУ ВШЭ (Высшая Школа Экономики), Бакалавр «Бизнес-информатика», 2020
— GoPractice Simulator: Управление продуктом на основе данных, 2021`,
    afterResumeTextEn: `Maxim Grigoryev
Senior Product Manager (B2B SaaS / Growth / Unit Economics)
Remote | +7 (999) 333-44-55 | maxim.grigoryev.pm@example.com | linkedin.com/in/maxim-grigoryev

PROFESSIONAL SUMMARY
Senior Product Manager with 5+ years driving B2B SaaS growth, unit economics optimization, and data-informed roadmap execution. Proven ability to scale ARR from $1.2M to $3.1M, double onboarding activation, and maintain LTV/CAC ratio above 3.8x. Skilled in Amplitude, SQL, statistical experimentation, and leading 12+ person engineering squads.

CORE SKILLS & METHODOLOGIES
— Analytics: SQL (ClickHouse, Postgres), Amplitude, Mixpanel, Tableau, Statistical A/B Testing
— Product Discovery: Customer Development (120+ user interviews), JTBD, CJM, User Journey Mapping
— Monetization & Business: Unit Economics (LTV, CAC, Payback, Churn), P&L Modeling, Pricing Tier Strategy
— Execution & Leadership: Cross-functional leadership (12 engineers/designers), OKRs, Agile/Scrum

WORK EXPERIENCE

DataSphere Cloud Platform — Remote
Senior Product Manager | 2022 — Present
— Led cross-functional squad of 12 (engineers, designer, data scientist) driving ARR growth from $1.2M to $3.1M (+158%) through Enterprise tier launch.
— Redesigned core user activation journey, increasing trial-to-paid conversion from 8.4% to 17.1% via guided self-serve setup.
— Conducted 65+ customer interviews uncovering enterprise compliance needs; delivered SSO/SAML integrations closing 14 Fortune-500 equivalent accounts.
— Built executive KPI tracking dashboards in Amplitude and Tableau with custom SQL queries, shortening analytical decision cycles from 14 days to 48 hours.

OmniChat SaaS — Remote
Product Manager (Growth) | 2020 — 2022
— Executed 32 hypothesis-driven A/B experiments across user retention loops, reducing monthly churn from 5.8% to 2.6%.
— Lowered Customer Acquisition Cost (CAC) by 28% via in-product viral loop mechanics and self-service expansion triggers.

EDUCATION & CREDENTIALS
— Higher School of Economics (HSE), B.S. in Business Informatics, 2020
— GoPractice Data-Driven Product Management Simulator Certification`
  },
  {
    slug: "data-scientist",
    roleRu: "Data Scientist / ML Engineer (PyTorch, LLM, MLOps, SQL)",
    roleEn: "Data Scientist / ML Engineer (PyTorch, LLM, MLOps, SQL)",
    level: "Middle+ / Senior",
    salaryRangeRu: "270 000 — 500 000 ₽ / месяц",
    salaryRangeEn: "$4,500 — $8,000 / month",
    demandBadge: "🤖 Спрос на LLM / RAG инженеров вырос на 210% в 2026 году",
    metaDescriptionRu: "Пример резюме Data Scientist и ML Engineer с аудитом ATS 95%. Как подтвердить навыки PyTorch, LLM/RAG, MLOps, SQL и оцифровать бизнес-метрики модели (AUC-ROC, F1, ROI).",
    metaDescriptionEn: "Data Scientist and ML Engineer ATS resume sample scoring 95%. Master PyTorch, LLM fine-tuning, RAG pipelines, MLOps, and quantitative business impact.",
    beforeScore: 60,
    afterScore: 95,
    breakdown: {
      hardSkills: 53,
      quantMetrics: 14,
      softSkills: 14,
      atsLayout: 14,
    },
    flawsRu: [
      "Академический тон («исследовал датасеты», «обучал нейросети») без привязки к бизнес-результатам и выводу в прод (MLOps).",
      "Отсутствие метрик точности модели (AUC-ROC, F1-Score, NDCG) и задержки инференса (latency).",
      "Не упомянуты современные технологии LLM, RAG, векторных БД (Qdrant, pgvector) и деплоя (FastAPI, Docker, Triton)."
    ],
    flawsEn: [
      "Academic descriptions ('studied datasets', 'trained neural network models') with zero MLOps production integration.",
      "No measurable model benchmark metrics (AUC-ROC, F1-score, NDCG, inference latency).",
      "Missing modern LLM, RAG, vector databases (Qdrant, pgvector), and model deployment pipelines."
    ],
    improvementsRu: [
      "Оцифрованные результаты: рост конверсии рекомендаций на +16%, сокращение затрат на инференс на 45% за счет квантования, P95 latency < 45ms.",
      "Полное соответствие стеку 2026: PyTorch, Hugging Face, LangChain, Qdrant, Triton Inference Server, MLflow, Docker, SQL.",
      "Одноколоночный гарвардский формат с акцентом на архитектуру MLOps."
    ],
    improvementsEn: [
      "Measurable achievements: boosted recommendation CTR by +16%, slashed inference compute cost by 45% via INT8 quantization.",
      "Modern 2026 stack: PyTorch, Hugging Face, RAG pipelines, Qdrant, Triton, MLflow, Docker, SQL.",
      "Clean ATS layout highlighting end-to-end production ML lifecycles."
    ],
    targetSkills: ["Python", "PyTorch", "LLM / RAG", "MLOps (MLflow, Kubeflow)", "Vector DB (Qdrant / Milvus)", "PostgreSQL / SQL", "Docker", "Triton Inference Server", "Pandas / NumPy", "FastAPI"],
    sampleJobSnippetRu: "Требования: Опыт в Data Science / Machine Learning от 3 лет. Уверенное владение Python, PyTorch, Scikit-learn, SQL. Опыт разработки и вывода в прод LLM / RAG систем или рекомендательных моделей. Понимание MLOps (MLflow, Docker, CI/CD). Умение оптимизировать инференс моделей.",
    sampleJobSnippetEn: "Requirements: 3+ years in Data Science / ML. Strong Python, PyTorch, Scikit-Learn, and SQL. Hands-on experience deploying LLM/RAG solutions or recommendation systems into production. MLOps tools (MLflow, Docker). Model optimization and inference latency tuning.",
    beforeResumeTextRu: `Дмитрий Соколов — Data Scientist / Аналитик
Email: dmitry.ds@example.com | Москва

Опыт:
Аналитическая Компания (2022 — по н.в.)
Data Scientist
— Анализировал данные с помощью Pandas и NumPy
— Обучал модели классификации и регрессии
— Строил графики в Matplotlib
— Писал скрипты на Python

Стартап ИИ (2021 — 2022)
Junior ML Engineer
— Занимался предобработкой текстовых данных
— Запускал готовые модели из Hugging Face
— Проверял гипотезы

Навыки:
Python, Scikit-learn, Pandas, Машинное обучение, SQL`,
    beforeResumeTextEn: `Dmitry Sokolov — Data Scientist
Email: dmitry.ds@example.com | Remote

Work:
Analytics Co (2022 — Present)
Data Scientist
— Analyzed datasets with Pandas and NumPy
— Trained classification and regression models
— Plotted charts in Matplotlib
— Wrote Python scripts

AI Startup (2021 — 2022)
Junior ML Engineer
— Cleaned text data
— Ran open-source Hugging Face models
— Tested data hypotheses

Skills:
Python, Scikit-learn, Pandas, Machine Learning, SQL`,
    afterResumeTextRu: `Дмитрий Соколов
Senior Data Scientist / ML Engineer (PyTorch / LLM & RAG / MLOps)
Москва | +7 (999) 444-55-66 | dmitry.sokolov.ml@example.com | github.com/dmitry-sokolov-ml

ПРОФЕССИОНАЛЬНЫЙ ПРОФИЛЬ
Machine Learning Engineer с 4+ годами опыта проектирования и внедрения в промышленную эксплуатацию нейросетевых моделей и RAG-систем на базе LLM. Эксперт в PyTorch, векторных хранилищах (Qdrant) и оптимизации инференса (Triton, ONNX Runtime). Реализовал рекомендательный пайплайн, принесший компании дополнительно 34 млн ₽ выручки.

КЛЮЧЕВЫЕ ТЕХНИЧЕСКИЕ НАВЫКИ
— Фреймворки и библиотеки: Python, PyTorch, Hugging Face Transformers, LangChain, Scikit-learn, Pandas, NumPy
— Генеративный AI и NLP: Fine-Tuning LLM (Llama, Mistral), RAG (Retrieval-Augmented Generation), Qdrant, pgvector
— MLOps и инфраструктура: MLflow, Docker, Kubernetes, Triton Inference Server, ONNX Runtime, DVC, CI/CD
— Данные и базы данных: PostgreSQL, ClickHouse, Apache Spark, сложный SQL (окна, оптимизация запросов)

ПРОФЕССИОНАЛЬНЫЙ ОПЫТ

Финтех Холдинг «АльфаСмарт» — Москва
Lead / Senior Data Scientist | 2022 — настоящее время
— Спроектировал и развернул в проде корпоративную RAG-систему на базе open-source LLM и векторной базы данных Qdrant, автоматизировавшую ответы на 73% рутинных обращений клиентов с точностью ответов 94.2%.
— Реализовал рекомендательную систему товаров на PyTorch с эмбеддингами графовых сетей, что повысило CTR рекомендательных блоков на 18.5% и конверсию в покупку на 2.4%.
— Оптимизировал задержку инференса моделей с помощью ONNX Runtime и квантования INT8 на Triton Inference Server, снизив потребление GPU-памяти на 52% и P95 латентность с 180 мс до 38 мс.
— Настроил полноценный MLOps пайплайн на базе MLflow и Docker, сократив цикл переобучения и деплоя новых весов моделей с 3 недель до 4 часов.

Лаборатория Искусственного Интеллекта — Москва
Middle ML Engineer | 2021 — 2022
— Обучил модель кредитного скоринга (Gradient Boosting) на выборке из 2.4 млн записей, увеличив метрику ROC-AUC с 0.74 до 0.83 и снизив дефолтность кредитного портфеля на 1.8%.
— Автоматизировал сбор и валидацию данных из ClickHouse через Apache Spark.

ОБРАЗОВАНИЕ
— МГУ им. М.В. Ломоносова, Факультет ВМК, Магистр прикладной математики и информатики, 2021`,
    afterResumeTextEn: `Dmitry Sokolov
Senior Data Scientist / ML Engineer (PyTorch / LLM & RAG / MLOps)
Remote | +7 (999) 444-55-66 | dmitry.sokolov.ml@example.com | github.com/dmitry-sokolov-ml

PROFESSIONAL SUMMARY
Machine Learning Engineer with 4+ years architecting and scaling production LLM, RAG, and deep learning systems. Proficient in PyTorch, vector databases (Qdrant, pgvector), MLOps pipelines (MLflow, Triton), and high-throughput inference optimization. Deployed recommendation engines generating $1.1M in incremental revenue.

TECHNICAL SKILLS
— Machine Learning & NLP: PyTorch, Hugging Face, LLM Fine-Tuning (LoRA/QLoRA), RAG pipelines, Scikit-learn
— Vector Search & DBs: Qdrant, pgvector, PostgreSQL, ClickHouse, Apache Spark, Advanced SQL
— MLOps & Production: MLflow, Docker, Kubernetes, Triton Inference Server, ONNX Runtime, FastAPI
— Python Stack: NumPy, Pandas, Polars, SciPy, Matplotlib

WORK EXPERIENCE

Fintech AI Solutions — Remote
Senior Machine Learning Engineer | 2022 — Present
— Built enterprise-grade RAG pipeline using open-source LLMs and Qdrant vector database, resolving 73% of customer inquiries with 94.2% factual precision.
— Architected multi-stage PyTorch recommendation model with graph embeddings, elevating user CTR by 18.5% and conversion by 2.4%.
— Quantized inference models to INT8 using ONNX Runtime on Triton Server, cutting GPU cloud costs by 52% and latency from 180ms to 38ms (P95).
— Automated end-to-end MLOps pipeline via MLflow and Docker, reducing model retraining release lifecycle from 3 weeks to 4 hours.

AI Research Lab — Remote
Middle ML Engineer | 2021 — 2022
— Trained credit risk classification pipeline (Gradient Boosting) over 2.4M records, raising ROC-AUC from 0.74 to 0.83.
— Streamlined feature engineering workflows in ClickHouse and PySpark for 100M+ event streams.

EDUCATION
— Lomonosov Moscow State University, M.S. in Applied Mathematics & Computer Science, 2021`
  },
  {
    slug: "devops-sre",
    roleRu: "Senior DevOps / SRE Инженер (Kubernetes, Terraform, CI/CD)",
    roleEn: "Senior DevOps / SRE Engineer (Kubernetes, Terraform, CI/CD)",
    level: "Middle+ / Senior",
    salaryRangeRu: "300 000 — 520 000 ₽ / месяц",
    salaryRangeEn: "$5,000 — $8,500 / month",
    demandBadge: "🛡️ Высочайшая зарплатная вилка и дефицит квалифицированных SRE",
    metaDescriptionRu: "Пример резюме DevOps / SRE Engineer с оценкой 96% в ATS. Полный разбор: как продемонстрировать опыт Kubernetes, Terraform, IaC, CI/CD и поддержание аптайма 99.99%.",
    metaDescriptionEn: "DevOps and SRE Engineer ATS resume case study scoring 96%. Master Kubernetes clusters, Terraform IaC, Prometheus observability, and 99.99% SLA.",
    beforeScore: 61,
    afterScore: 96,
    breakdown: {
      hardSkills: 54,
      quantMetrics: 14,
      softSkills: 14,
      atsLayout: 14,
    },
    flawsRu: [
      "Размытые фразы системного администрирования («ставил софт на сервера», «настраивал Nginx») вместо Infrastructure as Code (IaC).",
      "Отсутствие цифр аптайма (SLA/SLO/SLI 99.99%) и экономии бюджета на облачную инфраструктуру (FinOps).",
      "Нет упоминания инструментов автоматизации GitOps (ArgoCD), Terraform, Helm и распределенного мониторинга."
    ],
    flawsEn: [
      "Outdated sysadmin tone ('installed server software', 'configured Nginx') instead of Infrastructure as Code (IaC).",
      "No measurable uptime figures (SLA/SLO 99.99%), MTTR reduction, or FinOps cloud cost savings.",
      "Missing modern GitOps (ArgoCD), Terraform modules, Helm, and distributed tracing keywords."
    ],
    improvementsRu: [
      "Оцифрованные показатели надежности: поддержание 99.99% SLA, снижение MTTR с 50 до 8 минут, экономия 35% бюджета на AWS/Yandex Cloud.",
      "100% покрытие современных технологий: Kubernetes, Helm, Terraform, Ansible, ArgoCD, Prometheus, VictoriaMetrics, GitLab CI.",
      "Гарвардский стандарт резюме, идеально проходящий парсинг корпоративных ATS."
    ],
    improvementsEn: [
      "Quantified reliability impact: upheld 99.99% SLA, slashed MTTR from 50 to 8 minutes, cut cloud costs by 35%.",
      "Full stack coverage: Kubernetes, Helm, Terraform, Ansible, ArgoCD, Prometheus, VictoriaMetrics, GitLab CI.",
      "Clean single-column Harvard ATS template parsing without data loss."
    ],
    targetSkills: ["Kubernetes (k8s)", "Terraform", "Docker", "GitLab CI / GitHub Actions", "ArgoCD (GitOps)", "Prometheus / Grafana", "Linux / Bash", "Ansible", "AWS / Yandex Cloud", "SRE (SLO/SLA)"],
    sampleJobSnippetRu: "Требования: Опыт работы DevOps / SRE от 3 лет. Глубокие знания Kubernetes (управление кластерами, Helm, сетевые политики). Опыт написания модулей Terraform (IaC). Построение CI/CD пайплайнов (GitLab CI, ArgoCD). Мониторинг и алертинг (Prometheus, VictoriaMetrics, Grafana, Alertmanager). Опыт поддержания высокой доступности 99.95%+.",
    sampleJobSnippetEn: "Requirements: 3+ years in DevOps / SRE. Deep Kubernetes expertise (cluster operations, Helm, ingress, CNI). Terraform IaC automation. Enterprise CI/CD with GitLab CI and ArgoCD GitOps. Observability (Prometheus, Grafana, Alertmanager). 99.95%+ SLA track record.",
    beforeResumeTextRu: `Павел Кузнецов — DevOps Инженер / Системный Администратор
Email: pavel.devops@example.com | Москва

Опыт:
Облачные Решения (2022 — по н.в.)
DevOps Инженер
— Настраивал сервера на Linux
— Разворачивал контейнеры в Docker
— Писал скрипты автоматизации на Bash
— Следил за работой серверов

Хостинг Сервис (2020 — 2022)
Системный администратор
— Устанавливал операционные системы и Nginx
— Резервное копирование баз данных
— Реагировал на поломки серверов

Навыки:
Linux, Docker, Bash, Nginx, Git, Администрирование`,
    beforeResumeTextEn: `Pavel Kuznetsov — DevOps / Sysadmin
Email: pavel.devops@example.com | Remote

Work:
Cloud Solutions (2022 — Present)
DevOps Engineer
— Configured Linux servers
— Deployed Docker containers
— Wrote Bash automation scripts
— Monitored server uptime

Hosting Provider (2020 — 2022)
System Administrator
— Installed OS and Nginx web servers
— Configured database backups
— Responded to server downtime

Skills:
Linux, Docker, Bash, Nginx, Git, Administration`,
    afterResumeTextRu: `Павел Кузнецов
Senior DevOps / SRE Engineer (Kubernetes / Terraform / GitOps)
Москва | +7 (999) 555-66-77 | pavel.kuznetsov.devops@example.com | github.com/pavelkuznetsov-devops

ПРОФЕССИОНАЛЬНЫЙ ПРОФИЛЬ
Инженер по надежности инфраструктуры (SRE / DevOps) с 5+ годами опыта проектирования отказоустойчивых облачных сред и автоматизации CI/CD. Экспертиза в оркестрации Kubernetes, Terraform (IaC), GitOps (ArgoCD) и FinOps оптимизации. Обеспечил стабильную доступность сервисов 99.99% при пиковых нагрузках до 40 000 запросов в секунду.

КЛЮЧЕВЫЕ ТЕХНИЧЕСКИЕ НАВЫКИ
— Оркестрация и контейнеры: Kubernetes (Bare-Metal, Managed K8s), Helm v3, Docker, containerd, Istio Service Mesh
— Инфраструктура как код (IaC): Terraform (модульная архитектура), Terragrunt, Ansible
— Непрерывная доставка (CI/CD): GitLab CI, ArgoCD (GitOps подход), GitHub Actions
— Мониторинг и наблюдаемость: Prometheus, VictoriaMetrics, Grafana, Alertmanager, OpenTelemetry, ELK Stack
— Облака и ОС: Yandex Cloud, AWS (EKS, S3, RDS, IAM), Linux (Ubuntu, Debian, RHEL), Bash, Python

ПРОФЕССИОНАЛЬНЫЙ ОПЫТ

Финтех Платформа «ГлобалПей» — Москва
Senior DevOps / SRE Engineer | 2022 — настоящее время
— Спроектировал и развернул с помощью Terraform отказоустойчивый мультизональный кластер Kubernetes на 60+ нод, выдерживающий нагрузку 40 000 RPS с соблюдением SLA 99.99%.
— Внедрил концепцию GitOps на базе ArgoCD для 45 микросервисов, сократив время доставки релиза в прод со 120 минут до 6 минут с автоматическим rollback при сбоях.
— Провел FinOps аудит облачной инфраструктуры (AWS / Yandex Cloud), оптимизировав использование Spot-инстансов и распределение ресурсов, что сократило ежемесячные расходы на $18 000 (-34%).
— Реализовал централизованную систему метрик и логов на базе VictoriaMetrics и ELK, сократив время локализации и исправления инцидентов (MTTR) с 48 до 7 минут.

ИТ-Интегратор «ДатаСистемс» — Москва
Middle DevOps Engineer | 2020 — 2022
— Автоматизировал развертывание 25 тестовых стендов по запросу разработчиков через GitLab CI и Ansible, сократив время простоя команд на 40%.
— Настроил резервное копирование PostgreSQL и Kafka с регулярным автоматизированным тестированием восстановления данных (RTO < 15 мин, RPO < 1 мин).

ОБРАЗОВАНИЕ И СЕРТИФИКАЦИИ
— МИФИ (Национальный исследовательский ядерный университет), Бакалавр «Информационная безопасность», 2020
— Certified Kubernetes Administrator (CKA), Linux Foundation
— HashiCorp Certified: Terraform Associate`,
    afterResumeTextEn: `Pavel Kuznetsov
Senior DevOps / SRE Engineer (Kubernetes / Terraform / GitOps)
Remote | +7 (999) 555-66-77 | pavel.kuznetsov.devops@example.com | github.com/pavelkuznetsov-devops

PROFESSIONAL SUMMARY
DevOps / Site Reliability Engineer with 5+ years building highly available multi-cloud architectures, automated GitOps delivery pipelines, and robust observability stacks. Expertise in Kubernetes, Terraform IaC, ArgoCD, and FinOps cloud cost optimization. Upheld 99.99% SLA across high-traffic payment architectures.

TECHNICAL SKILLS
— Orchestration: Kubernetes (EKS, Bare-Metal), Helm 3, Docker, Istio Service Mesh
— Infrastructure as Code: Terraform, Terragrunt, Ansible, CloudFormation
— CI/CD & GitOps: ArgoCD, GitLab CI/CD, GitHub Actions
— Observability: Prometheus, VictoriaMetrics, Grafana, Alertmanager, ELK / OpenSearch, OpenTelemetry
— Clouds & OS: AWS (EKS, RDS, S3), GCP, Linux (Ubuntu, RHEL), Bash, Python

WORK EXPERIENCE

GlobalPay Fintech — Remote
Senior SRE / DevOps Engineer | 2022 — Present
— Architected multi-region Kubernetes cluster via Terraform across 60+ nodes sustaining 40,000 RPS with 99.99% availability SLA.
— Implemented enterprise GitOps workflows via ArgoCD across 45 microservices, cutting deployment turnaround from 120 minutes to 6 minutes with auto-rollback.
— Spearheaded FinOps cloud optimization audit on AWS, slashing monthly infrastructure bills by $18,000 (-34%) via spot instances and autoscaling policies.
— Built unified observability platform (VictoriaMetrics, Grafana, OpenTelemetry), reducing Mean Time To Resolution (MTTR) from 48 minutes to 7 minutes.

DataSystems Integrator — Remote
Middle DevOps Engineer | 2020 — 2022
— Automated on-demand ephemeral staging environments via GitLab CI and Ansible, boosting developer delivery velocity by 40%.
— Implemented disaster recovery automation for PostgreSQL and Kafka ensuring RTO < 15m and RPO < 1m.

EDUCATION & CERTIFICATIONS
— MEPhI National Research Nuclear University, B.S. in Information Security, 2020
— Certified Kubernetes Administrator (CKA)
— HashiCorp Certified: Terraform Associate`
  },
  {
    slug: "system-analyst",
    roleRu: "Lead / Senior Системный Аналитик (REST API, SQL, UML, Kafka)",
    roleEn: "Lead / Senior System Analyst (REST API, SQL, UML, Kafka)",
    level: "Middle+ / Senior",
    salaryRangeRu: "230 000 — 410 000 ₽ / месяц",
    salaryRangeEn: "$3,800 — $6,500 / month",
    demandBadge: "📋 Ключевое связующее звено в Enterprise и финтех проектах",
    metaDescriptionRu: "Пример резюме Системного Аналитика с оценкой 94% в ATS. Полный разбор: описание API по OpenAPI/Swagger, проектирование схем данных SQL и очередей Kafka без шаблонной воды.",
    metaDescriptionEn: "System Analyst ATS resume case study scoring 94%. Learn how to detail OpenAPI/Swagger specs, SQL schema architecture, and Kafka integration contracts.",
    beforeScore: 59,
    afterScore: 94,
    breakdown: {
      hardSkills: 52,
      quantMetrics: 14,
      softSkills: 14,
      atsLayout: 14,
    },
    flawsRu: [
      "Фокус на общих обязанностях («собирал требования», «писал документацию») без конкретных технических артефактов (Swagger, ERD, XSD/JSON Schema).",
      "Отсутствие упоминаний архитектуры интеграций (синхронные REST/gRPC vs асинхронные очереди Kafka/RabbitMQ).",
      "Двухколоночный дизайн резюме с потерянными ключевыми словами при ATS-сканировании."
    ],
    flawsEn: [
      "Generic duty descriptions ('gathered requirements', 'wrote documentation') without concrete technical specs (Swagger, ERD, JSON Schema).",
      "Missing integration architecture specifics (sync REST/gRPC vs async Kafka/RabbitMQ event streams).",
      "Multi-column Canva formatting failing ATS keyword extraction."
    ],
    improvementsRu: [
      "Указаны четкие технические артефакты: OpenAPI 3.0, спецификации топиков Kafka, ER-диаграммы в DBeaver, схемы Sequence в PlantUML.",
      "Оцифрованные результаты: ускорение разработки фичей на 30% за счет детализированных ТЗ, интеграция с 18 внешними банками-партнерами.",
      "Гарвардский одноколоночный формат с 100% распознаванием всеми HR-системами."
    ],
    improvementsEn: [
      "Concrete technical deliverables: OpenAPI 3.0, Kafka topic specs, ER-diagrams, PlantUML sequence flows.",
      "Quantified outcomes: accelerated team development velocity by 30% via zero-ambiguity specs, integrated with 18 partner banks.",
      "Single-column Harvard layout parsing cleanly."
    ],
    targetSkills: ["System Analysis", "REST API (OpenAPI / Swagger)", "SQL (PostgreSQL)", "UML / BPMN", "Apache Kafka (AsyncAPI)", "Postman", "PlantUML / Draw.io", "Microservices Architecture", "Confluence / Jira", "JSON Schema / XML"],
    sampleJobSnippetRu: "Требования: Опыт работы системным аналитиком от 3 лет. Глубокое понимание интеграций (REST API, SOAP, Kafka). Умение проектировать OpenAPI спецификации в Swagger. Уверенное владение SQL (написание сложных запросов, проектирование реляционных схем данных). Построение UML диаграмм (Sequence, Activity, State).",
    sampleJobSnippetEn: "Requirements: 3+ years as a System Analyst. Strong integration background (REST API, Kafka, gRPC). Designing OpenAPI/Swagger specifications. Strong SQL proficiency (complex queries and relational data schemas). UML diagramming (Sequence, Activity).",
    beforeResumeTextRu: `Елена Морозова — Системный Аналитик
Email: elena.sa@example.com | Москва

Опыт:
Банковские Технологии (2022 — по н.в.)
Системный Аналитик
— Собирала требования с бизнеса
— Писала технические задания для разработчиков
— Общалась с тестировщиками
— Участвовала в согласовании архитектуры

ИТ Интеграция (2020 — 2022)
Младший аналитик
— Описывала бизнес-процессы в BPMN
— Тестировала запросы в Postman
— Вела документацию в Confluence

Навыки:
Jira, Confluence, BPMN, UML, SQL, Анализ требований`,
    beforeResumeTextEn: `Elena Morozova — System Analyst
Email: elena.sa@example.com | Remote

Work:
Banking Technologies (2022 — Present)
System Analyst
— Gathered requirements from business
— Wrote technical specifications for developers
— Communicated with QA team
— Aligned architecture solutions

IT Integrations (2020 — 2022)
Junior Analyst
— Documented business processes in BPMN
— Tested API requests in Postman
— Maintained Confluence documentation

Skills:
Jira, Confluence, BPMN, UML, SQL, Requirements Gathering`,
    afterResumeTextRu: `Елена Морозова
Lead / Senior System Analyst (REST API / Kafka / SQL / Enterprise)
Москва | +7 (999) 666-77-88 | elena.morozova.analyst@example.com | linkedin.com/in/elena-morozova-sa

ПРОФЕССИОНАЛЬНЫЙ ПРОФИЛЬ
Ведущий системный аналитик с 5+ годами опыта проектирования интеграционных решений, микросервисных архитектур и распределенных систем в финтехе и e-commerce. Эксперт в проектировании контрактов REST API (OpenAPI 3.0), асинхронных очередей на Apache Kafka и оптимизации моделей данных SQL. Обеспечила успешный запуск интеграции с 18 банками-партнерами.

КЛЮЧЕВЫЕ ТЕХНИЧЕСКИЕ НАВЫКИ
— Проектирование API и контрактов: OpenAPI 3.0 (Swagger), AsyncAPI (Kafka), gRPC (Protobuf), JSON Schema, XSD
— Моделирование систем: UML (Sequence, Activity, Class, State diagrams), BPMN 2.0, PlantUML, Draw.io
— Базы данных и запросы: PostgreSQL, Oracle, сложный SQL (SELECT, JOIN, Window Functions, DDL, DML)
— Инструменты тестирования и трекинга: Postman, SoapUI, DBeaver, Jira, Confluence, Git

ПРОФЕССИОНАЛЬНЫЙ ОПЫТ

Финтех Платформа «Вектор Банк» — Москва
Lead System Analyst | 2022 — настоящее время
— Спроектировала архитектуру интеграционного шлюза открытого банкинга (Open Banking API) по стандарту OpenAPI 3.0, обеспечив подключение 18 банков-партнеров с объемом операций более 350 млн ₽ в месяц.
— Разработала спецификации асинхронного обмена сообщениями на базе Apache Kafka и паттерна Event-Driven Architecture, исключив рассинхронизацию остатков на счетах и снизив время обработки транзакции с 4.5с до 300мс.
— Спроектировала реляционную модель данных (35 сущностей) в PostgreSQL с полной нормализацией до 3НФ и оптимизацией индексов.
— Разработала исчерпывающие интерактивные Sequence-диаграммы в PlantUML и маппинги данных, что сократило количество уточнений и доработок со стороны команды бэкенд-разработки на 32%.

ИТ Интегратор «Омега Консалтинг» — Москва
Senior System Analyst | 2020 — 2022
— Описала и регламентировала 40+ ключевых сквозных бизнес-процессов кредитования физических лиц в нотации BPMN 2.0, сократив время рассмотрения заявки с 24 часов до 15 минут.
— Создала тестовую коллекцию из 150+ запросов в Postman с автоматическими тестами валидации схемы ответа.

ОБРАЗОВАНИЕ
— МГУ им. М.В. Ломоносова, Экономический факультет, Бакалавр «Экономика и бизнес-аналитика», 2020`,
    afterResumeTextEn: `Elena Morozova
Senior System Analyst (REST API / Kafka / SQL / Enterprise)
Remote | +7 (999) 666-77-88 | elena.morozova.analyst@example.com | linkedin.com/in/elena-morozova-sa

PROFESSIONAL SUMMARY
Senior System Analyst with 5+ years architecting enterprise integration specifications, microservices data models, and high-volume fintech transaction flows. Expert in OpenAPI 3.0 contracts, Apache Kafka event streams, relational SQL schema design, and PlantUML sequencing.

TECHNICAL SKILLS
— API & Protocols: OpenAPI 3.0 / Swagger, AsyncAPI (Kafka), gRPC Protobuf, REST, JSON Schema
— Modeling: UML (Sequence, Activity, State), BPMN 2.0, PlantUML, Enterprise Architect
— Databases: PostgreSQL, Oracle, Advanced SQL (analytical windows, joins, indexing)
— Tools: Postman, SoapUI, DBeaver, Jira, Confluence, Git

WORK EXPERIENCE

Vector Fintech Banking — Remote
Lead System Analyst | 2022 — Present
— Designed open banking API architecture complying with OpenAPI 3.0, onboarding 18 financial partners processing $50M+ monthly transactions.
— Authored AsyncAPI specs and event-driven data schemas for Apache Kafka messaging, reducing end-to-end transaction latency from 4.5s to 300ms.
— Architected normalized relational database schema (35 entities) in PostgreSQL ensuring complete referential integrity.
— Created comprehensive PlantUML sequence diagrams and data mapping sheets, decreasing engineering back-and-forth rework by 32%.

Omega Consulting Integrator — Remote
Middle System Analyst | 2020 — 2022
— Documented 40+ end-to-end loan approval flows in BPMN 2.0, slashing customer underwriting turnaround from 24 hours to 15 minutes.
— Developed Postman test collections with JSON Schema assertions verifying 150+ edge cases.

EDUCATION
— Lomonosov Moscow State University, B.S. in Business Analytics, 2020`
  },
  {
    slug: "ux-ui-designer",
    roleRu: "Senior UX/UI Product Designer (Figma, Design Systems, Research)",
    roleEn: "Senior UX/UI Product Designer (Figma, Design Systems, Research)",
    level: "Middle+ / Senior",
    salaryRangeRu: "220 000 — 390 000 ₽ / месяц",
    salaryRangeEn: "$3,500 — $6,200 / month",
    demandBadge: "🎨 Фокус на конверсионных интерфейсах и дизайн-системах",
    metaDescriptionRu: "Пример резюме UX/UI Product Designer с оценкой 95% в ATS. Как дизайнеру пройти автоматические фильтры, оцифровать влияние на бизнес-метрики и конверсию продукта.",
    metaDescriptionEn: "UX/UI Product Designer ATS resume example scoring 95%. How product designers can pass ATS bots with quantifiable usability metrics, Figma, and design systems.",
    beforeScore: 57,
    afterScore: 95,
    breakdown: {
      hardSkills: 53,
      quantMetrics: 14,
      softSkills: 14,
      atsLayout: 14,
    },
    flawsRu: [
      "Резюме в виде ссылки на Behance/Dribbble без текстового описания реализованных проектов и продуктовых метрик.",
      "Отсутствие упоминания количественных тестов удобства (SUS score, Time on Task, Task Completion Rate).",
      "Сложная двухколоночная графическая верстка из графических редакторов, не читаемая парсерами ATS."
    ],
    flawsEn: [
      "Resume presented solely as a Behance link without searchable text describing project scope or business metrics.",
      "Zero mention of quantitative usability metrics (SUS score, Task Completion Rate, Time on Task).",
      "Exported visual PDF from Figma/Illustrator that ATS OCR engines fail to parse."
    ],
    improvementsRu: [
      "Оцифрованные результаты: рост конверсии оформления заказа на +24%, сокращение времени онбординга на 40%, масштабирование дизайн-системы на 250+ компонентов.",
      "Полный охват продуктовых навыков: Figma, Design Tokens, Variables, Auto Layout, User Research, Prototyping, Usability Testing, A/B Testing.",
      "Гарвардский текстовый стандарт резюме с кликабельными ссылками на кейсы."
    ],
    improvementsEn: [
      "Quantified business results: +24% checkout conversion, 40% reduction in onboarding time, 250+ tokens design system scale.",
      "Full coverage of product design methods: Figma, Design Tokens, Auto Layout, User Testing, Prototyping, A/B Experimentation.",
      "Standard ATS Harvard single-column layout parsing smoothly into all corporate portals."
    ],
    targetSkills: ["Figma (Variables, Auto Layout)", "Design Systems (Tokens)", "User Research (CustDev)", "Usability Testing (SUS)", "Interactive Prototyping", "CJM & Wireframing", "A/B Testing", "Mobile Design (iOS / Android)", "Web Accessibility (WCAG)", "Design Hand-off"],
    sampleJobSnippetRu: "Требования: Опыт продуктового UX/UI дизайна от 3 лет. Экспертное владение Figma (Auto Layout, Components, Variables). Опыт создания и развития масштабируемых дизайн-систем. Проведение качественных и количественных исследований (CustDev, юзабилити-тесты). Понимание веб-доступности (WCAG 2.1) и метрик конверсии.",
    sampleJobSnippetEn: "Requirements: 3+ years in UX/UI product design. Mastery of Figma (Variables, Auto Layout, Component libraries). Developing enterprise design systems. Conducting quantitative usability testing and customer interviews. Accessibility standards (WCAG).",
    beforeResumeTextRu: `Мария Лебедева — UX/UI Дизайнер
Email: maria.design@example.com | Портфолио: behance.net/marialebe

О себе:
Креативный дизайнер с опытом 3 года. Люблю делать красивый и удобный дизайн мобильных приложений и сайтов.

Опыт:
Дизайн Студия (2022 — по н.в.)
UX/UI Designer
— Рисовала макеты в Figma
— Делала иконки и баннеры
— Передавала макеты разработчикам
— Участвовала в брейнштормах

Фриланс (2021 — 2022)
Дизайнер интерфейсов
— Создавала лендинги для клиентов
— Делала редизайн мобильных экранов

Навыки:
Figma, Photoshop, Illustrator, UI Дизайн, Креативность`,
    beforeResumeTextEn: `Maria Lebedeva — UX/UI Designer
Email: maria.design@example.com | Portfolio: behance.net/marialebe

About:
Creative designer with 3 years experience. Passionate about building attractive user interfaces for web and mobile.

Work:
Design Studio (2022 — Present)
UX/UI Designer
— Designed screens in Figma
— Created banners and icons
— Handed over designs to devs
— Brainstormed concepts

Freelance (2021 — 2022)
UI Designer
— Built landing pages for clients
— Redesigned mobile app screens

Skills:
Figma, Photoshop, Illustrator, UI Design, Creativity`,
    afterResumeTextRu: `Мария Лебедева
Senior UX/UI Product Designer (Figma / Design Systems / User Research)
Москва | +7 (999) 777-88-99 | maria.lebedeva.design@example.com | portfolio.maria-design.ru | linkedin.com/in/maria-lebedeva-ux

ПРОФЕССИОНАЛЬНЫЙ ПРОФИЛЬ
Ведущий продуктовый дизайнер интерфейсов с 5+ годами опыта создания высококонверсионных веб и мобильных сервисов (iOS / Android). Специализация: построение масштабируемых дизайн-систем в Figma (Variables, Design Tokens), проведение количественных юзабилити-тестирований и оптимизация воронки продукта. Добилась роста конверсии чекаута на +24%.

КЛЮЧЕВЫЕ ТЕХНИЧЕСКИЕ НАВЫКИ
— Инструменты и прототипирование: Figma (Variables, Component Properties, Auto Layout 5), ProtoPie, Principle
— Дизайн-системы: Design Tokens, Cross-platform Components, Storybook Hand-off, Регламенты и документация
— UX-исследования и аналитика: CustDev интервью, юзабилити-тестирование (SUS, Task Completion Rate), CJM, Hotjar, Amplitude
— Стандарты и доступность: WCAG 2.1 (AA), Human Interface Guidelines (iOS), Material Design 3 (Android)

ПРОФЕССИОНАЛЬНЫЙ ОПЫТ

Финтех Экосистема «НеоБанк» — Москва
Lead / Senior Product Designer | 2022 — настоящее время
— Провела комплексный редизайн процесса открытия брокерского счёта и первого пополнения, увеличив конверсию воронки с 31% до 55% (+24 п.п.) и снизив отток пользователей на 18%.
— Спроектировала с нуля кросс-платформенную дизайн-систему на 320+ адаптивных компонентов и 140 дизайн-токенов в Figma, сократив время сборки макетов дизайнерами на 45% и ускорив верстку разработчиками на 30%.
— Провела 48 модерируемых юзабилити-тестирований и глубинных интервью, выявив критические барьеры восприятия тарифов и повысив индекс удобства системы (System Usability Scale — SUS) с 64 до 86 баллов.
— Внедрила строгие стандарты цифровой доступности WCAG 2.1 AA (контрастность, экранные дикторы), расширив охват сервиса для слабовидящих пользователей.

Диджитал Агентство «Интерфейс Лаб» — Москва
Product Designer | 2020 — 2022
— Спроектировала мобильное e-commerce приложение с нуля (MAU 180 000+), обеспечив рейтинг 4.8 в App Store и Google Play.
— Совместно с продуктовым менеджером провела 14 A/B экспериментов карточки товара, увеличив добавление в корзину на 16.4%.

ОБРАЗОВАНИЕ
— Британская высшая школа дизайна (БВШД), Продуктовый дизайн и UX, 2020
— МГУ им. М.В. Ломоносова, Бакалавр «Связи с общественностью и медиа», 2019`,
    afterResumeTextEn: `Maria Lebedeva
Senior UX/UI Product Designer (Figma / Design Systems / User Research)
Remote | +7 (999) 777-88-99 | maria.lebedeva.design@example.com | portfolio.maria-design.ru | linkedin.com/in/maria-lebedeva-ux

PROFESSIONAL SUMMARY
Senior Product Designer with 5+ years crafting high-converting web and mobile experiences across iOS and Android. Expertise in multi-brand Figma design systems (Variables, Design Tokens), quantitative usability evaluation, and funnel conversion optimization. Lifted checkout completion by +24%.

TECHNICAL SKILLS
— UI & Prototyping: Figma (Variables, Auto Layout, Components), ProtoPie, Principle
— Design Systems: Design Tokens, Storybook alignment, Cross-platform Guidelines
— UX Research: Moderated testing, SUS benchmarking, Customer Interviews, CJM, Amplitude, Hotjar
— Accessibility: WCAG 2.1 AA compliance, Apple HIG, Material Design 3

WORK EXPERIENCE

NeoBank Fintech Ecosystem — Remote
Lead Product Designer | 2022 — Present
— Redesigned investment account opening and initial deposit flow, increasing completion conversion from 31% to 55% (+24 percentage points).
— Architected multi-platform design system in Figma comprising 320+ components and 140 semantic tokens, speeding up frontend sprint delivery by 30%.
— Conducted 48 user research interviews and usability test sessions, raising System Usability Scale (SUS) score from 64 to 86.
— Ensured WCAG 2.1 AA digital accessibility across all consumer banking flows.

Interface Lab Agency — Remote
Product Designer | 2020 — 2022
— Designed e-commerce mobile application from zero to 180k+ MAU, earning 4.8-star App Store rating.
— Partnered with growth teams on 14 A/B product experiments, achieving +16.4% lift in Add-to-Cart conversions.

EDUCATION
— British Higher School of Art & Design, Product & UX Design, 2020`
  }
];

export function getResumeExampleBySlug(slug: string): SeoResumeExample | undefined {
  return SEO_RESUME_EXAMPLES.find((ex) => ex.slug === slug);
}
