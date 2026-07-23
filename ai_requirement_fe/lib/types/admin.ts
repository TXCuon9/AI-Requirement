export interface UserPendingResponse {
    id: number;
    email: string;
    role: string;
    provider: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    companyName?: string;
    companyDescription?: string;
    industry?: string;
    companySize?: string;
    website?: string;
    location?: string;
    logoUrl?: string;
}
