package com.example.ai_requirement_be.dto.Admin;

public class AdminDashboardStatsDTO {
    private long totalCompanies;
    private long pendingCompanies;
    private long totalUsers;
    private long totalJobs;

    public AdminDashboardStatsDTO() {
    }

    public AdminDashboardStatsDTO(long totalCompanies, long pendingCompanies, long totalUsers, long totalJobs) {
        this.totalCompanies = totalCompanies;
        this.pendingCompanies = pendingCompanies;
        this.totalUsers = totalUsers;
        this.totalJobs = totalJobs;
    }

    public long getTotalCompanies() {
        return totalCompanies;
    }

    public void setTotalCompanies(long totalCompanies) {
        this.totalCompanies = totalCompanies;
    }

    public long getPendingCompanies() {
        return pendingCompanies;
    }

    public void setPendingCompanies(long pendingCompanies) {
        this.pendingCompanies = pendingCompanies;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }
}
