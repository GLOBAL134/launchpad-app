// ============================================================
// LaunchPad — Core Type Definitions
// ============================================================

/** Possible stages a job application can be in */
export type ApplicationStage =
  | "wishlist"
  | "applied"
  | "screening"
  | "interviewing"
  | "offer"
  | "rejected"
  | "ghosted";

/** A single job application tracked by the user */
export interface JobApplication {
  id: string;
  user_id: string;
  company: string;
  position: string;
  url: string | null;
  stage: ApplicationStage;
  salary_min: number | null;
  salary_max: number | null;
  location: string | null;
  remote: boolean;
  notes: string | null;
  job_description: string | null;
  resume_version: string | null;
  cover_letter: string | null;
  contact_name: string | null;
  contact_email: string | null;
  applied_at: string | null;
  followed_up_at: string | null;
  next_follow_up: string | null;
  created_at: string;
  updated_at: string;
}

/** A resume stored/parsed by the system */
export interface Resume {
  id: string;
  user_id: string;
  name: string;
  content: string; // plain text extracted from PDF
  file_url: string | null;
  created_at: string;
}

/** Result of an ATS scan */
export interface ATSScanResult {
  match_score: number; // 0-100
  missing_keywords: string[];
  present_keywords: string[];
  format_issues: string[];
  suggestions: string[];
  optimized_sections: Record<string, string>;
  scanned_at: string;
}

/** A generated cover letter */
export interface CoverLetter {
  id: string;
  user_id: string;
  application_id: string | null;
  company: string;
  position: string;
  content: string;
  tone: "professional" | "enthusiastic" | "concise";
  created_at: string;
}

/** A follow-up reminder */
export interface FollowUp {
  id: string;
  application_id: string;
  user_id: string;
  scheduled_date: string;
  message_draft: string;
  sent: boolean;
  created_at: string;
}

/** Analytics data for the dashboard */
export interface AnalyticsData {
  total_applications: number;
  by_stage: Record<ApplicationStage, number>;
  response_rate: number;
  interview_rate: number;
  offer_rate: number;
  avg_days_to_response: number;
  applications_this_week: number;
  applications_this_month: number;
  top_companies: { company: string; count: number }[];
}

/** Stage column configuration for Kanban */
export interface StageColumn {
  id: ApplicationStage;
  title: string;
  icon: string;
  color: string;
}

export const STAGE_COLUMNS: StageColumn[] = [
  { id: "wishlist", title: "Wishlist", icon: "📌", color: "bg-slate-500/20" },
  { id: "applied", title: "Applied", icon: "📨", color: "bg-blue-500/20" },
  { id: "screening", title: "Screening", icon: "🔍", color: "bg-cyan-500/20" },
  { id: "interviewing", title: "Interview", icon: "📞", color: "bg-yellow-500/20" },
  { id: "offer", title: "Offer", icon: "🎉", color: "bg-green-500/20" },
  { id: "rejected", title: "Rejected", icon: "❌", color: "bg-red-500/20" },
  { id: "ghosted", title: "Ghosted", icon: "👻", color: "bg-gray-500/20" },
];
