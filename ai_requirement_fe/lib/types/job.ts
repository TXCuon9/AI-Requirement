export interface JobResponse {
  id: number;
  companyName: string | null;
  companyLogo: string | null;
  industry?: string | null;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  location: string;
  remote: boolean;
  jobType: string;
  experienceLevel: string;
  status: string;
  expiredAt: string | null;
  createdAt: string | null;
}

export interface JobDetailResponse {
  id: number;
  companyName: string | null;
  companyLogo: string | null;
  industry?: string | null;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  location: string;
  remote: boolean;
  jobType: string;
  experienceLevel: string;
}
