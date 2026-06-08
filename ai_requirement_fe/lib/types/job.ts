export interface JobResponse {
  id: number;
  companyName: string | null;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  salaryMin: number | null;
  salaryMax: number | null;
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
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  salaryMin: number | null;
  salaryMax: number | null;
  location: string;
  remote: boolean;
  jobType: string;
  experienceLevel: string;
}
