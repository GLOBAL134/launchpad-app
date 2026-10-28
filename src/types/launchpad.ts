export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  createdAt: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  contractTime: string;
  category: string;
  isRemote: boolean;
}

export interface SkillMatchEvidence {
  skill: string;
  foundInResume: boolean;
  resumeQuoteEvidence: string | null;
  category: 'hard' | 'soft';
}

export interface ResumeImprovement {
  section: string;
  originalSnippet: string;
  suggestedRewrite: string;
  reason: string;
}

export interface ATSAnalysisResponse {
  success: boolean;
  engineUsed: 'ai_verified' | 'deterministic_nlp';
  atsScore: number;
  scoreBreakdown: {
    hardSkillsScore: number;
    softSkillsScore: number;
    impactScore: number;
    structureScore: number;
  };
  matchedHardSkills: SkillMatchEvidence[];
  missingHardSkills: string[];
  matchedSoftSkills: string[];
  missingSoftSkills: string[];
  measurableMetricsFound: string[];
  criticalIssues: string[];
  improvements: ResumeImprovement[];
  coverLetter: string;
  analyzedAt: string;
}

export type ApplicationStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface TrackedApplication {
  id: string;
  job: JobListing;
  status: ApplicationStatus;
  atsScore?: number;
  coverLetter?: string;
  notes: string;
  updatedAt: string;
}

export interface UserSubscriptionState {
  tier: 'free' | 'pro';
  scansUsedToday: number;
  maxDailyScans: number;
}
