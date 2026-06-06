export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface KeywordAnalysis {
  keyword: string;
  count: number;
  density: string;
  relevance: "High" | "Medium" | "Low" | string;
}

export interface Analysis {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  targetJobRole: string;
  filePath: string;
  atsScore: number;
  jobMatchPercentage: number;
  industryReadinessScore: number;
  skillsExtracted: string[];
  skillsMissing: string[];
  resumeStrength: number;
  keywordAnalysis: KeywordAnalysis[];
  aiSummary: string;
  improvementSuggestions: string[];
  detectedJobRole: string;
}

export type SidebarTab =
  | "Dashboard"
  | "Upload Resume"
  | "AI Analysis"
  | "Reports"
  | "History"
  | "Profile"
  | "Settings"
  | "Logout";

export interface ActiveSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}
