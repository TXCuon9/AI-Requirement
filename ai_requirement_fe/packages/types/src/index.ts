export type UserRole = "admin" | "recruiter" | "candidate";

export type JobSummary = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
};

export type CompanySummary = {
  id: string;
  name: string;
  industry: string;
  location: string;
  openRoles: number;
};
