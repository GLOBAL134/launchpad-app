'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import {
  JobListing,
  ATSAnalysisResponse,
  TrackedApplication,
  ApplicationStatus,
} from '../types/launchpad';

const STORAGE_KEYS = {
  RESUME_TEXT: 'launchpad_pro_resume_v1',
  TRACKED_APPS: 'launchpad_pro_applications_v1',
  SCAN_HISTORY: 'launchpad_pro_last_scan_v1',
};

export default function LaunchPadProWorkspace() {
  const [activeNav, setActiveNav] = useState<'jobs' | 'ats' | 'tracker'>('jobs');

  // Состояния поиска вакансий
  const [searchQuery, setSearchQuery] = useState('React TypeScript Developer');
  const [locationFilter, setLocationFilter] = useState('');
  const [country, setCountry] = useState('us');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minSalary, setMinSalary] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'salary'>('relevance');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsWarning, setJobsWarning] = useState<string | null>(null);

  // Состояния ATS-сканера и Генератора писем
  const [resumeText, setResumeText] = useState('');
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [targetJobDesc, setTargetJobDesc] = useState('');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResponse | null>(null);
  const [atsSubTab, setAtsSubTab] = useState<'report' | 'letter'>('report');
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Состояния Трекер-доски (Канбан)
  const [applications, setApplications] = useState<TrackedApplication[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Загрузка сохранённых данных пользователя при старте
  useEffect(() => {
    try {
      const savedResume = localStorage.getItem(STORAGE_KEYS.RESUME_TEXT);
      if (savedResume) setResumeText(savedResume);

      const savedApps = localStorage.getItem(STORAGE_KEYS.TRACKED_APPS);
      if (savedApps) setApplications(JSON.parse(savedApps));

      const savedScan = localStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
      if (savedScan) setAnalysisResult(JSON.parse(savedScan));
    } catch (e) {
      console.error('Ошибка чтения локального хранилища:', e);
    }
  }, []);

  // Автосохранение текста резюме
  useEffect(() => {
    if (resumeText.trim().length > 20) {
      localStorage.setItem(STORAGE_KEYS.RESUME_TEXT, resumeText);
    }
  }, [resumeText]);

  // Автосохранение трекера вакансий
  const saveApplications = (updated: TrackedApplication[]) => {
    setApplications(updated);
    localStorage.setItem(STORAGE_KEYS.TRACKED_APPS, JSON.stringify(updated));
  };

  // Запрос вакансий с сервера
  const fetchJobs = useCallback(async () => {
    setJobsLoading(true);
    setJobsWarning(null);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        location: locationFilter,
        country,
        remote: String(remoteOnly),
        minSalary: String(minSalary),
        sort: sortBy,
      });

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();

      if (data.warning) {
        setJobsWarning(data.warning);
      }
      setJobs(data.jobs || []);
      setTotalJobs(data.totalCount || 0);
    } catch {
      setJobsWarning('Не удалось загрузить список вакансий. Проверьте подключение.');
    } finally {
      setJobsLoading(false);
    }
  }, [searchQuery, locationFilter, country, remoteOnly, minSalary, sortBy]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Переход от вакансии сразу к ATS-сканеру в 1 клик
  const handleSelectJobForATS = (job: JobListing) => {
    setTargetJobTitle(job.title);
    setTargetCompany(job.company);
    setTargetJobDesc(job.description);
    setActiveNav('ats');
    showToast(`Вакансия «${job.title}» загружена в ATS-сканер`);
  };

  // Сохранение вакансии в Трекер откликов
  const handleSaveToTracker = (job: JobListing) => {
    if (applications.some((a) => a.job.id === job.id)) {
      showToast('Эта вакансия уже есть в вашем трекере');
      return;
    }

    const newApp: TrackedApplication = {
      id: `app_${Date.now()}_${job.id}`,
      job,
      status: 'saved',
      atsScore: analysisResult?.atsScore,
      coverLetter: analysisResult?.coverLetter,
      notes: '',
      updatedAt: new Date().toISOString(),
    };
    saveApplications([newApp, ...applications]);
    showToast('Вакансия добавлена в Канбан-трекер');
  };

  const handleUpdateAppStatus = (id: string, status: ApplicationStatus) => {
    const updated = applications.map((app) =>
      app.id === id ? { ...app, status, updatedAt: new Date().toISOString() } : app
    );
    saveApplications(updated);
  };

  const handleDeleteApp = (id: string) => {
    saveApplications(applications.filter((a) => a.id !== id));
    showToast('Запись удалена из трекера');
  };

  // Загрузка файла резюме
  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzeError(null);

    try {
      const text = await file.text();
      const cleaned = text.replace(/[^\x20-\x7Eа-яА-ЯёЁ\n\r\t.,:;!?()[\]{}@#$%^&*+=_\-|/\\<>"'`~]/g, ' ');
      if (cleaned.trim().length < 50) {
        setAnalyzeError('Не удалось извлечь текстовый слой. Пожалуйста, скопируйте и вставьте текст резюме в поле ниже.');
        return;
      }
      setResumeText(cleaned);
      showToast(`Файл «${file.name}» успешно загружен`);
    } catch {
      setAnalyzeError('Ошибка чтения файла. Вставьте текст резюме вручную.');
    }
  };

  // Запуск реального ATS-анализа
  const handleRunATSAnalysis = async () => {
    setAnalyzeError(null);
    if (resumeText.trim().length < 80) {
      setAnalyzeError('Вставьте полный текст вашего резюме (минимум 80 символов).');
      return;
    }
    if (targetJobDesc.trim().length < 40) {
      setAnalyzeError('Вставьте описание целевой вакансии (минимум 40 символов).');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription: targetJobDesc,
          jobTitle: targetJobTitle || 'Разработчик / Специалист',
          companyName: targetCompany || 'Технологическая компания',
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка анализа резюме');
      }

      setAnalysisResult(data);
      localStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(data));
      showToast(`Анализ завершён! Ваш ATS-индекс: ${data.atsScore}%`);
    } catch (err: unknown) {
      const error = err as Error;
      setAnalyzeError(error.message || 'Произошла ошибка при обращении к серверу анализа.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyCoverLetter = async () => {
    if (!analysisResult?.coverLetter) return;
    await navigator.clipboard.writeText(analysisResult.coverLetter);
    setCopiedLetter(true);
    showToast('Сопроводительное письмо скопировано в буфер обмена');
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handleDownloadCoverLetter = () => {
    if (!analysisResult?.coverLetter) return;
    const blob = new Blob([analysisResult.coverLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover_Letter_${(targetCompany || 'Company').replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Уведомление (Toast) */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-indigo-400/30 text-sm font-medium animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Верхняя навигационная панель */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
              🚀
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">LaunchPad</span>
              <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI PRO
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveNav('jobs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                activeNav === 'jobs'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Поиск вакансий
            </button>
            <button
              onClick={() => setActiveNav('ats')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                activeNav === 'ats'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ATS-Сканер & Письмо
            </button>
            <button
              onClick={() => setActiveNav('tracker')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                activeNav === 'tracker'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Трекер
              {applications.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-slate-800 text-indigo-300">
                  {applications.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ВКЛАДКА 1: ПОИСК ВАКАНСИЙ ADZUNA */}
        {activeNav === 'jobs' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-5">
                  <label className="block text-xs text-slate-400 mb-1">Должность или стек</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                    placeholder="Например: Fullstack Engineer, Python..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs text-slate-400 mb-1">Город или регион</label>
                  <input
                    type="text"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                    placeholder="New York, London, Berlin..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Страна</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="us">США (US)</option>
                    <option value="gb">Великобритания (UK)</option>
                    <option value="de">Германия (DE)</option>
                    <option value="nl">Нидерланды (NL)</option>
                    <option value="ca">Канада (CA)</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={fetchJobs}
                    disabled={jobsLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm text-white transition"
                  >
                    {jobsLoading ? 'Поиск...' : 'Найти'}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={remoteOnly}
                      onChange={(e) => setRemoteOnly(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-indigo-600"
                    />
                    Только удалённая работа (Remote)
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Сортировка:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'salary')}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200"
                    >
                      <option value="relevance">По релевантности</option>
                      <option value="date">По дате публикации</option>
                      <option value="salary">По уровню зарплаты</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Мин. зарплата:</span>
                    <select
                      value={minSalary}
                      onChange={(e) => setMinSalary(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200"
                    >
                      <option value={0}>Любая</option>
                      <option value={50000}>50 000+</option>
                      <option value={80000}>80 000+</option>
                      <option value={100000}>100 000+</option>
                      <option value={150000}>150 000+</option>
                    </select>
                  </div>
                </div>

                <span className="text-slate-400">
                  Найдено вакансий: <strong className="text-slate-200">{totalJobs}</strong>
                </span>
              </div>
            </div>

            {jobsWarning && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-300">
                {jobsWarning}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {jobsLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-36 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse p-6"
                  />
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-slate-900/75 hover:bg-slate-900 border border-slate-800/90 hover:border-indigo-500/40 rounded-2xl p-5 transition shadow-lg flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white">{job.title}</h3>
                        {job.isRemote && (
                          <span className="px-2 py-0.5 text-[11px] rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            Remote
                          </span>
                        )}
                        {(job.salaryMin || job.salaryMax) && (
                          <span className="px-2 py-0.5 text-[11px] rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium">
                            {job.currency}
                            {job.salaryMin?.toLocaleString() || ''}
                            {job.salaryMax ? ` - ${job.currency}${job.salaryMax.toLocaleString()}` : '+'}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 flex items-center gap-3">
                        <span className="font-medium text-slate-300">{job.company}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex md:flex-col justify-end gap-2 shrink-0">
                      <button
                        onClick={() => handleSelectJobForATS(job)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition shadow-md shadow-indigo-600/20"
                      >
                        ⚡ ATS-скан и Письмо
                      </button>
                      <button
                        onClick={() => handleSaveToTracker(job)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
                      >
                        ★ В трекер
                      </button>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl border border-slate-700 hover:border-slate-500 text-center text-xs font-medium text-slate-300 transition"
                      >
                        Откликнуться ↗
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                  <p className="text-base font-semibold text-slate-200">
                    Вакансии по текущему фильтру не найдены
                  </p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Попробуйте изменить поисковый запрос, отключить фильтр «Только удалёнка» или сразу перейдите на вкладку «ATS-Сканер & Письмо» для проверки резюме под любую внешнюю вакансию.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ВКЛАДКА 2: РЕАЛЬНЫЙ ATS-СКАНЕР И ГЕНЕРАТОР ПИСЕМ */}
        {activeNav === 'ats' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Данные для проверки</h2>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'ru' | 'en')}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300"
                >
                  <option value="ru">Язык письма: Русский</option>
                  <option value="en">Letter Language: English</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">1. Текст вашего резюме</label>
                  <label className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium">
                    Загрузить файл (.txt, .md)
                    <input
                      type="file"
                      accept=".txt,.md"
                      onChange={handleResumeFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={8}
                  placeholder="Вставьте полный текст вашего резюме (опыт работы, навыки, достижения, контакты)..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs sm:text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Сохраняется автоматически в браузере</span>
                  <span>Символов: {resumeText.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Целевая должность</label>
                  <input
                    type="text"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    placeholder="Senior Frontend Developer"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Компания</label>
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs sm:text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  2. Текст вакансии (Требования и обязанности)
                </label>
                <textarea
                  value={targetJobDesc}
                  onChange={(e) => setTargetJobDesc(e.target.value)}
                  rows={6}
                  placeholder="Вставьте описание вакансии или выберите любую вакансию во вкладке «Поиск вакансий»..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs sm:text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {analyzeError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {analyzeError}
                </div>
              )}

              <button
                onClick={handleRunATSAnalysis}
                disabled={isAnalyzing}
                className="w-full py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 font-semibold text-sm text-white transition shadow-lg shadow-indigo-600/25"
              >
                {isAnalyzing ? 'Выполняем сверку навыков и цитат...' : 'Рассчитать ATS-балл и создать письмо'}
              </button>
            </div>

            {/* Результаты ATS и сопроводительного письма */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
              {analysisResult ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAtsSubTab('report')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                          atsSubTab === 'report'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        ATS-Аудит ({analysisResult.atsScore}%)
                      </button>
                      <button
                        onClick={() => setAtsSubTab('letter')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                          atsSubTab === 'letter'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Сопроводительное письмо
                      </button>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">
                      Движок: {analysisResult.engineUsed === 'ai_verified' ? 'AI + Верификация цитат' : 'Детерминированный NLP'}
                    </span>
                  </div>

                  {atsSubTab === 'report' ? (
                    <div className="space-y-6">
                      {/* Декомпозиция балла */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center">
                          <div className="text-2xl font-extrabold text-indigo-400">
                            {analysisResult.atsScore}%
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">Общий ATS-балл</div>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center">
                          <div className="text-xl font-bold text-emerald-400">
                            {analysisResult.scoreBreakdown.hardSkillsScore}%
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">Hard Skills (55%)</div>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center">
                          <div className="text-xl font-bold text-amber-400">
                            {analysisResult.scoreBreakdown.impactScore}%
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">Метрики и цифры (15%)</div>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center">
                          <div className="text-xl font-bold text-sky-400">
                            {analysisResult.scoreBreakdown.structureScore}%
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">Структура резюме (15%)</div>
                        </div>
                      </div>

                      {/* Подтверждённые и отсутствующие навыки */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                            Найдено в резюме ({analysisResult.matchedHardSkills.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.matchedHardSkills.length > 0 ? (
                              analysisResult.matchedHardSkills.map((item, i) => (
                                <span
                                  key={i}
                                  title={`Подтверждено цитатой: "${item.resumeQuoteEvidence}"`}
                                  className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 cursor-help"
                                >
                                  ✓ {item.skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500">Точных совпадений не обнаружено</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3">
                            Не хватает в резюме ({analysisResult.missingHardSkills.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.missingHardSkills.length > 0 ? (
                              analysisResult.missingHardSkills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 rounded-lg text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300"
                                >
                                  ✕ {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-emerald-400">Все ключевые навыки присутствуют!</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Замечания и улучшения */}
                      {analysisResult.criticalIssues.length > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                            Критические точки роста:
                          </h4>
                          <ul className="list-disc list-inside text-xs text-amber-200/90 space-y-1">
                            {analysisResult.criticalIssues.map((issue, idx) => (
                              <li key={idx}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysisResult.improvements.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                            Рекомендации по усилению формулировок:
                          </h4>
                          {analysisResult.improvements.map((imp, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5 text-xs"
                            >
                              <div className="font-semibold text-indigo-400">{imp.section}</div>
                              <div className="text-slate-400 line-through">{imp.originalSnippet}</div>
                              <div className="text-emerald-300 font-medium">→ {imp.suggestedRewrite}</div>
                              <div className="text-slate-500 italic">{imp.reason}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Вкладка письма */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          Письмо составлено строго по вашим подтверждённым навыкам:
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCopyCoverLetter}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
                          >
                            {copiedLetter ? '✓ Скопировано' : 'Копировать'}
                          </button>
                          <button
                            onClick={handleDownloadCoverLetter}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white"
                          >
                            Скачать .txt
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={analysisResult.coverLetter}
                        onChange={(e) =>
                          setAnalysisResult({ ...analysisResult, coverLetter: e.target.value })
                        }
                        rows={16}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-sm leading-relaxed text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="my-auto text-center py-20 space-y-3">
                  <div className="text-4xl">🎯</div>
                  <h3 className="text-base font-bold text-slate-200">
                    Запустите реальный ATS-аудит вашего резюме
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Вставьте текст резюме и описание вакансии слева. Алгоритм проверит точные совпадения навыков, найдёт подтверждающие цитаты, посчитает честный индекс релевантности и составит сопроводительное письмо.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ВКЛАДКА 3: КАНБАН-ТРЕКЕР ОТКЛИКОВ */}
        {activeNav === 'tracker' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Канбан-трекер ваших откликов</h2>
                <p className="text-xs text-slate-400">
                  Управляйте воронкой трудоустройства: от сохранённой вакансии до оффера
                </p>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <p className="text-base font-semibold text-slate-200">В трекере пока нет сохранённых вакансий</p>
                <p className="text-xs text-slate-400">
                  Нажмите «★ В трекер» на любой карточке во вкладке «Поиск вакансий», чтобы отслеживать статус отклика.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {([
                  { key: 'saved', label: 'Сохранено' },
                  { key: 'applied', label: 'Отправлен отклик' },
                  { key: 'interview', label: 'Интервью' },
                  { key: 'offer', label: 'Оффер 🎉' },
                ] as const).map((col) => {
                  const colApps = applications.filter((a) => a.status === col.key);
                  return (
                    <div
                      key={col.key}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 min-h-[380px]"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          {col.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300">
                          {colApps.length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {colApps.map((item) => (
                          <div
                            key={item.id}
                            className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow"
                          >
                            <div className="font-semibold text-xs text-white">{item.job.title}</div>
                            <div className="text-[11px] text-slate-400">
                              {item.job.company} • {item.job.location}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
                              <select
                                value={item.status}
                                onChange={(e) =>
                                  handleUpdateAppStatus(item.id, e.target.value as ApplicationStatus)
                                }
                                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200"
                              >
                                <option value="saved">Сохранено</option>
                                <option value="applied">Отправлен отклик</option>
                                <option value="interview">Интервью</option>
                                <option value="offer">Оффер</option>
                              </select>

                              <button
                                onClick={() => handleDeleteApp(item.id)}
                                className="text-[11px] text-rose-400 hover:text-rose-300"
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
