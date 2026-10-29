"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { JobApplication, ApplicationStage } from "@/types";
import { DEMO_APPLICATIONS } from "@/lib/demo-data";
import {
  isUserPro,
  getRemainingFreeScans,
  incrementScanUsage,
  verifyAndActivateProKey,
  addBonusScans as libAddBonusScans,
} from "@/lib/monetization";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  title: string;
}

export interface AuthSession {
  name: string;
  email: string;
  title: string;
  phone?: string;
  isDemo: boolean;
  isFirstTime?: boolean;
  createdAt: string;
}

export interface FollowUpItem {
  id: string;
  appId: string;
  company: string;
  position: string;
  contactName: string;
  contactEmail: string;
  urgency: "overdue" | "today" | "upcoming";
  daysElapsed: number;
  subject: string;
  template: string;
  sent: boolean;
}

interface AppContextType {
  // Auth Session & Gate
  authSession: AuthSession | null;
  isAuthLoaded: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalDefaultTab: "register" | "login";
  openAuthModal: (tab?: "register" | "login") => void;
  login: (userData: {
    name: string;
    email: string;
    title?: string;
    phone?: string;
    seedDemoJobs?: boolean;
    isFirstTime?: boolean;
  }) => void;
  loginDemo: () => void;
  logout: () => void;

  // User profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;

  // Applications (Tracker / Kanban)
  applications: JobApplication[];
  addApplication: (appData: {
    company: string;
    position: string;
    salary?: string;
    location?: string;
    stage?: ApplicationStage;
    job_description?: string;
    notes?: string;
    cover_letter?: string;
    resume_version?: string;
  }) => void;
  moveStage: (id: string, stage: ApplicationStage) => void;
  deleteApplication: (id: string) => void;
  resetToDemo: () => void;
  clearAllApplications: () => void;
  isAddJobModalOpen: boolean;
  setIsAddJobModalOpen: (open: boolean) => void;

  // Follow-ups
  followUps: FollowUpItem[];
  markFollowUpSent: (id: string) => void;
  activeFollowUpsCount: number;

  // Monetization & PRO
  isPro: boolean;
  remainingScans: number;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  upgradeReason: string | undefined;
  setUpgradeReason: (reason?: string) => void;
  activateWithKey: (key: string) => boolean;
  consumeScan: () => void;
  addBonusScans: (count: number) => void;

  // Cross-page navigation helpers
  scannerTargetJob: { company: string; position: string; description?: string } | null;
  setScannerTargetJob: (job: { company: string; position: string; description?: string } | null) => void;
  coverLetterTargetJob: { company: string; position: string } | null;
  setCoverLetterTargetJob: (job: { company: string; position: string } | null) => void;
  triggerQuickAudit: boolean;
  setTriggerQuickAudit: (trigger: boolean) => void;

  // Global Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Backup & Restore
  exportBackupData: () => void;
  importBackupData: (jsonData: string) => boolean;

  // Language & Localization
  lang: "ru" | "en";
  setLang: (lang: "ru" | "en") => void;
}

const AUTH_SESSION_KEY = "launchpad_auth_session_v1";

const STORAGE_KEYS = {
  USER_PROFILE: "lp_user_profile_v2",
  APPLICATIONS: "lp_applications_v2",
  FOLLOW_UPS: "lp_followups_v2",
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Алексей Морозов",
  email: "alex.morozov@email.ru",
  phone: "+7 (999) 123-45-67",
  title: "Senior Product Manager",
};

const INITIAL_FOLLOW_UPS: FollowUpItem[] = [
  {
    id: "fu-1",
    appId: "2",
    company: "Т-Банк",
    position: "Lead Frontend Engineer (Next.js)",
    contactName: "Елена Смирнова",
    contactEmail: "recruiting@tbank.ru",
    urgency: "today",
    daysElapsed: 7,
    subject: "Уточнение статуса рассмотрения резюме: Lead Frontend Engineer",
    template: `Здравствуйте!

Я отправлял отклик на позицию Lead Frontend Engineer ровно 7 дней назад и хотел подтвердить свою высокую заинтересованность в работе над платформой Т-Банка. Обладая опытом оптимизации производительности микрофронтендов и построения дизайн-систем, я уверен, что смогу принести пользу команде.

Подскажите, удалось ли ознакомиться с резюме, и требуются ли какие-либо дополнительные материалы с моей стороны?`,
    sent: false,
  },
  {
    id: "fu-2",
    appId: "6",
    company: "VK",
    position: "Data Scientist (Рекомендации)",
    contactName: "Ольга Ковалева",
    contactEmail: "hr@vk.team",
    urgency: "overdue",
    daysElapsed: 12,
    subject: "Статус отклика: Data Scientist (Рекомендации)",
    template: `Здравствуйте, команда подбора VK!

Пишу вежливо уточнить статус рассмотрения моего отклика на вакансию Data Scientist в команду рекомендаций, направленного две недели назад.

Вакансия по-прежнему для меня в приоритете, так как мои наработки в графовых сетях напрямую перекликаются с задачами вашей умной ленты.

Буду очень признателен за краткий апдейт по процессу отбора.`,
    sent: false,
  },
  {
    id: "fu-3",
    appId: "10",
    company: "Selectel",
    position: "Infrastructure Platform Engineer",
    contactName: "Команда подбора",
    contactEmail: "careers@selectel.ru",
    urgency: "upcoming",
    daysElapsed: 3,
    subject: "Отклик на вакансию: Infrastructure Platform Engineer",
    template: `Здравствуйте!

Недавно подавал отклик на роль Infrastructure Platform Engineer в Selectel. Очень импонирует технологический стек и подход вашей команды к масштабированию инфраструктуры.

Буду рад получить обратную связь, когда резюме будет рассмотрено нанимающим менеджером.`,
    sent: false,
  },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Auth state
  const [authSession, setAuthSession] = useState<AuthSession | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState<"register" | "login">("register");

  // User & Workspace state
  const [userProfile, setUserProfileState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [applications, setApplicationsState] = useState<JobApplication[]>([]);
  const [followUps, setFollowUpsState] = useState<FollowUpItem[]>([]);

  const [isPro, setIsPro] = useState(false);
  const [remainingScans, setRemainingScans] = useState(2);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string | undefined>(undefined);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [scannerTargetJob, setScannerTargetJob] = useState<{ company: string; position: string; description?: string } | null>(null);
  const [coverLetterTargetJob, setCoverLetterTargetJob] = useState<{ company: string; position: string } | null>(null);
  const [triggerQuickAudit, setTriggerQuickAudit] = useState(false);
  const [lang, setLangState] = useState<"ru" | "en">("ru");

  const setLang = useCallback((newLang: "ru" | "en") => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("lp_user_lang", newLang);
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  }, []);

  const openAuthModal = useCallback((tab?: "register" | "login") => {
    setAuthModalDefaultTab(tab || "register");
    setIsAuthModalOpen(true);
  }, []);

  // Hydrate from localStorage and URL
  useEffect(() => {
    if (typeof window === "undefined") return;

    let sessionFound = false;

    // 0. Auth Session verification
    try {
      const savedSession = localStorage.getItem(AUTH_SESSION_KEY);
      if (savedSession) {
        const parsed: AuthSession = JSON.parse(savedSession);
        setAuthSession(parsed);
        sessionFound = true;
        setUserProfileState((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          email: parsed.email || prev.email,
          title: parsed.title || prev.title,
          phone: parsed.phone || prev.phone,
        }));
      } else {
        setAuthSession(null);
      }
    } catch {
      setAuthSession(null);
    } finally {
      setIsAuthLoaded(true);
    }

    // 1. User profile
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (savedProfile) {
        setUserProfileState(JSON.parse(savedProfile));
      }
    } catch {
      // fallback
    }

    // 2. Applications (load only if session exists or was saved)
    try {
      const savedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (savedApps) {
        setApplicationsState(JSON.parse(savedApps));
      } else if (sessionFound) {
        setApplicationsState(DEMO_APPLICATIONS);
      } else {
        setApplicationsState([]);
      }
    } catch {
      // fallback
    }

    // 3. Follow-ups
    try {
      const savedFollowUps = localStorage.getItem(STORAGE_KEYS.FOLLOW_UPS);
      if (savedFollowUps) {
        setFollowUpsState(JSON.parse(savedFollowUps));
      } else if (sessionFound) {
        setFollowUpsState(INITIAL_FOLLOW_UPS);
      } else {
        setFollowUpsState([]);
      }
    } catch {
      // fallback
    }

    // 4. PRO status & URL key verification (?pro_key=...)
    const params = new URLSearchParams(window.location.search);
    const proKey = params.get("pro_key");
    if (proKey && verifyAndActivateProKey(proKey)) {
      setIsPro(true);
      setRemainingScans(Infinity);
      showToast("🎉 Тариф LaunchPad AI PRO успешно активирован!");
      const url = new URL(window.location.href);
      url.searchParams.delete("pro_key");
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
    } else {
      setIsPro(isUserPro());
      setRemainingScans(getRemainingFreeScans());
    }

    // 5. Automatic language detection from browser or saved preference
    try {
      const savedLang = localStorage.getItem("lp_user_lang");
      if (savedLang === "ru" || savedLang === "en") {
        setLangState(savedLang);
      } else {
        const browserLang = (navigator.language || (navigator as any).userLanguage || "").toLowerCase();
        const isRu =
          browserLang.startsWith("ru") ||
          browserLang.startsWith("be") ||
          browserLang.startsWith("uk") ||
          browserLang.startsWith("kk");
        setLangState(isRu ? "ru" : "en");
      }
    } catch {
      // fallback
    }
  }, [showToast]);

  const login = useCallback(
    (userData: {
      name: string;
      email: string;
      title?: string;
      phone?: string;
      seedDemoJobs?: boolean;
      isFirstTime?: boolean;
    }) => {
      const session: AuthSession = {
        name: userData.name,
        email: userData.email,
        title: userData.title || "Product Manager / IT-специалист",
        phone: userData.phone || "+7 (999) 000-00-00",
        isDemo: false,
        isFirstTime: userData.isFirstTime ?? true,
        createdAt: new Date().toISOString(),
      };

      setAuthSession(session);
      try {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
      } catch (err) {
        console.error(err);
      }

      const newProfile: UserProfile = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "+7 (999) 000-00-00",
        title: userData.title || "Product Manager / IT-специалист",
      };
      setUserProfileState(newProfile);
      try {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(newProfile));
      } catch (err) {
        console.error(err);
      }

      if (userData.seedDemoJobs === false) {
        setApplicationsState([]);
        setFollowUpsState([]);
        try {
          localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
          localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify([]));
        } catch (err) {
          console.error(err);
        }
      } else {
        setApplicationsState(DEMO_APPLICATIONS);
        setFollowUpsState(INITIAL_FOLLOW_UPS);
        try {
          localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(DEMO_APPLICATIONS));
          localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(INITIAL_FOLLOW_UPS));
        } catch (err) {
          console.error(err);
        }
      }

      setIsAuthModalOpen(false);
      showToast(`Добро пожаловать в командный центр, ${userData.name.split(" ")[0]}! 👋`);
    },
    [showToast]
  );

  const loginDemo = useCallback(() => {
    const demoSession: AuthSession = {
      name: "Алексей Морозов",
      email: "alex.morozov@email.ru",
      title: "Senior Product Manager",
      phone: "+7 (999) 123-45-67",
      isDemo: true,
      isFirstTime: false,
      createdAt: new Date().toISOString(),
    };

    setAuthSession(demoSession);
    try {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(demoSession));
    } catch (err) {
      console.error(err);
    }

    setUserProfileState(DEFAULT_PROFILE);
    setApplicationsState(DEMO_APPLICATIONS);
    setFollowUpsState(INITIAL_FOLLOW_UPS);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_PROFILE));
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(DEMO_APPLICATIONS));
      localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(INITIAL_FOLLOW_UPS));
    } catch (err) {
      console.error(err);
    }

    setIsAuthModalOpen(false);
    showToast("👀 Запущен демонстрационный режим кабинета");
  }, [showToast]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_SESSION_KEY);
    } catch (err) {
      console.error(err);
    }
    setAuthSession(null);
    setApplicationsState([]);
    setFollowUpsState([]);
    showToast("Вы вышли из аккаунта");
  }, [showToast]);

  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfileState((prev) => {
      const updated = { ...prev, ...profile };
      try {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });

    // Also sync to authSession if present
    setAuthSession((prev) => {
      if (!prev) return null;
      const updatedSession: AuthSession = {
        ...prev,
        name: profile.name || prev.name,
        email: profile.email || prev.email,
        title: profile.title || prev.title,
        phone: profile.phone || prev.phone,
      };
      try {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedSession));
      } catch (err) {
        console.error(err);
      }
      return updatedSession;
    });

    showToast("Профиль соискателя успешно обновлён");
  }, [showToast]);

  const addApplication = useCallback((appData: {
    company: string;
    position: string;
    salary?: string;
    location?: string;
    stage?: ApplicationStage;
    job_description?: string;
    notes?: string;
    cover_letter?: string;
    resume_version?: string;
  }) => {
    const salaryNums = (appData.salary || "").match(/\d[\d\s]*/g);
    let salaryMin: number | null = null;
    let salaryMax: number | null = null;
    if (salaryNums && salaryNums[0]) {
      salaryMin = parseInt(salaryNums[0].replace(/\s/g, ""), 10);
      salaryMax = salaryNums[1] ? parseInt(salaryNums[1].replace(/\s/g, ""), 10) : salaryMin;
    }

    const newApp: JobApplication = {
      id: "app-" + Date.now(),
      user_id: "user",
      company: appData.company.trim(),
      position: appData.position.trim(),
      url: null,
      stage: appData.stage || "wishlist",
      salary_min: salaryMin,
      salary_max: salaryMax,
      location: appData.location || "Удаленно",
      remote: true,
      notes: appData.notes || null,
      job_description: appData.job_description || null,
      resume_version: appData.resume_version || "Основное резюме",
      cover_letter: appData.cover_letter || null,
      contact_name: null,
      contact_email: null,
      applied_at: appData.stage === "applied" ? new Date().toISOString() : null,
      followed_up_at: null,
      next_follow_up: appData.stage === "applied" ? new Date(Date.now() + 6 * 86400000).toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setApplicationsState((prev) => {
      const next = [newApp, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });

    // Auto-create follow-up reminder on day 6
    if (appData.stage === "applied") {
      const newFollowUp: FollowUpItem = {
        id: "fu-" + Date.now(),
        appId: newApp.id,
        company: newApp.company,
        position: newApp.position,
        contactName: "Команда найма",
        contactEmail: "hr@" + newApp.company.toLowerCase().replace(/[^a-z0-9]/g, "") + ".ru",
        urgency: "upcoming",
        daysElapsed: 0,
        subject: `Уточнение статуса рассмотрения резюме: ${newApp.position} в ${newApp.company}`,
        template: `Здравствуйте, команда ${newApp.company}!\n\nНаправлял отклик на вакансию «${newApp.position}» и хотел подтвердить свою высокую заинтересованность в работе в вашей компании.\n\nПодскажите, удалось ли нанимающему менеджеру ознакомиться с резюме? Буду рад краткой обратной связи.\n\nС уважением,\n${userProfile.name}`,
        sent: false,
      };

      setFollowUpsState((prev) => {
        const next = [newFollowUp, ...prev];
        try {
          localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(next));
        } catch (err) {
          console.error(err);
        }
        return next;
      });
    }

    showToast(`Отклик в «${newApp.company}» успешно добавлен в пайплайн!`);
  }, [showToast, userProfile.name]);

  const moveStage = useCallback((id: string, stage: ApplicationStage) => {
    setApplicationsState((prev) => {
      const next = prev.map((app) =>
        app.id === id
          ? {
              ...app,
              stage,
              updated_at: new Date().toISOString(),
              applied_at: stage === "applied" && !app.applied_at ? new Date().toISOString() : app.applied_at,
            }
          : app
      );
      try {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  }, []);

  const deleteApplication = useCallback((id: string) => {
    setApplicationsState((prev) => {
      const app = prev.find((a) => a.id === id);
      const next = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      if (app) showToast(`Вакансия «${app.company}» удалена из трекера`);
      return next;
    });
  }, [showToast]);

  const resetToDemo = useCallback(() => {
    setApplicationsState(DEMO_APPLICATIONS);
    setFollowUpsState(INITIAL_FOLLOW_UPS);
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(DEMO_APPLICATIONS));
      localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(INITIAL_FOLLOW_UPS));
    } catch (err) {
      console.error(err);
    }
    showToast("Демо-данные успешно загружены!");
  }, [showToast]);

  const clearAllApplications = useCallback(() => {
    setApplicationsState([]);
    setFollowUpsState([]);
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify([]));
    } catch (err) {
      console.error(err);
    }
    showToast("Канбан-трекер очищен: вы можете вести свои реальные отклики");
  }, [showToast]);

  const markFollowUpSent = useCallback((id: string) => {
    setFollowUpsState((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, sent: true } : item));
      try {
        localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast("Напоминание отмечено как отправленное!");
  }, [showToast]);

  const activateWithKey = useCallback((key: string) => {
    if (verifyAndActivateProKey(key)) {
      setIsPro(true);
      setRemainingScans(Infinity);
      showToast("🎉 Тариф LaunchPad AI PRO успешно активирован!");
      return true;
    }
    return false;
  }, [showToast]);

  const consumeScan = useCallback(() => {
    incrementScanUsage();
    setRemainingScans(getRemainingFreeScans());
  }, []);

  const addBonusScans = useCallback((count: number) => {
    libAddBonusScans(count);
    setRemainingScans(getRemainingFreeScans());
    showToast(`🎁 Вам начислено +${count} бесплатных проверок резюме!`);
  }, [showToast]);

  const exportBackupData = useCallback(() => {
    if (typeof window === "undefined") return;

    const backupPayload = {
      version: "2026.1",
      exportedAt: new Date().toISOString(),
      userProfile,
      applications,
      followUps,
      savedResume: localStorage.getItem("launchpad_scanner_resume") || "",
      savedJob: localStorage.getItem("launchpad_scanner_job") || "",
    };

    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `launchpad_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("✓ Резервная копия (Backup JSON) успешно сохранена на диск!");
  }, [userProfile, applications, followUps, showToast]);

  const importBackupData = useCallback(
    (jsonData: string): boolean => {
      try {
        const parsed = JSON.parse(jsonData);

        if (parsed.userProfile && typeof parsed.userProfile === "object") {
          setUserProfileState(parsed.userProfile);
          localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(parsed.userProfile));
        }

        if (Array.isArray(parsed.applications)) {
          setApplicationsState(parsed.applications);
          localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(parsed.applications));
        }

        if (Array.isArray(parsed.followUps)) {
          setFollowUpsState(parsed.followUps);
          localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(parsed.followUps));
        }

        if (typeof parsed.savedResume === "string" && parsed.savedResume) {
          localStorage.setItem("launchpad_scanner_resume", parsed.savedResume);
        }

        if (typeof parsed.savedJob === "string" && parsed.savedJob) {
          localStorage.setItem("launchpad_scanner_job", parsed.savedJob);
        }

        showToast("✓ Все данные и карточки успешно восстановлены из бэкапа!");
        return true;
      } catch (err) {
        console.error("Backup import error:", err);
        showToast("Ошибка: поврежденный или неверный формат JSON файла резервной копии.");
        return false;
      }
    },
    [showToast]
  );

  const activeFollowUpsCount = followUps.filter((f) => !f.sent).length;

  return (
    <AppContext.Provider
      value={{
        authSession,
        isAuthLoaded,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalDefaultTab,
        openAuthModal,
        login,
        loginDemo,
        logout,
        userProfile,
        updateUserProfile,
        isProfileModalOpen,
        setIsProfileModalOpen,
        applications,
        addApplication,
        moveStage,
        deleteApplication,
        resetToDemo,
        clearAllApplications,
        isAddJobModalOpen,
        setIsAddJobModalOpen,
        followUps,
        markFollowUpSent,
        activeFollowUpsCount,
        isPro,
        remainingScans,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        upgradeReason,
        setUpgradeReason,
        activateWithKey,
        consumeScan,
        addBonusScans,
        scannerTargetJob,
        setScannerTargetJob,
        coverLetterTargetJob,
        setCoverLetterTargetJob,
        triggerQuickAudit,
        setTriggerQuickAudit,
        toastMessage,
        showToast,
        exportBackupData,
        importBackupData,
        lang,
        setLang,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}