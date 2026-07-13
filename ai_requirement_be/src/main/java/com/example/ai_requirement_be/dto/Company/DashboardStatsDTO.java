package com.example.ai_requirement_be.dto.Company;

public class DashboardStatsDTO {
    private int activeJobsCount;
    private int pendingApplicationsCount;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(int activeJobsCount, int pendingApplicationsCount) {
        this.activeJobsCount = activeJobsCount;
        this.pendingApplicationsCount = pendingApplicationsCount;
    }

    public int getActiveJobsCount() {
        return activeJobsCount;
    }

    public void setActiveJobsCount(int activeJobsCount) {
        this.activeJobsCount = activeJobsCount;
    }

    public int getPendingApplicationsCount() {
        return pendingApplicationsCount;
    }

    public void setPendingApplicationsCount(int pendingApplicationsCount) {
        this.pendingApplicationsCount = pendingApplicationsCount;
    }
}
