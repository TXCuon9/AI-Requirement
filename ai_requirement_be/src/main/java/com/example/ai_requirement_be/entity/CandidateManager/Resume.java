package com.example.ai_requirement_be.entity.CandidateManager;

import com.example.ai_requirement_be.dto.Candidate.EducationItemDTO;
import com.example.ai_requirement_be.dto.Candidate.ExperienceItemDTO;
import com.example.ai_requirement_be.dto.Candidate.ProjectItemDTO;
import com.example.ai_requirement_be.entity.Job.JobApplication;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="resumes")
public class Resume {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="candidate_id" , nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private CandidateProfile candidateId;

    @OneToMany(mappedBy = "resume", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<JobApplication> jobApplications = new ArrayList<>();

// Thêm Getter/Setter cho jobApplications...

    @Column(name="file_url" , nullable = false , columnDefinition = "TEXT")
    private String fileUrl;

    @Column(name="cv_name", length = 255)
    private String cvName;

    @Column(name="parsed_text" , columnDefinition = "TEXT")
    private String parsedText;

    @Column(name="summary" , columnDefinition = "TEXT")
    private String summary;

    @Column(name="version")
    private Integer version = 1;

    // ép kiểu từ List sang Json
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name="skills")
    private List<String> skills;


    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name="experiences")
    private List<ExperienceItemDTO> experiences;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name="educations")
    private List<EducationItemDTO> educationItemDTOS;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name="projects")
    private List<ProjectItemDTO> projectItems;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_primary", columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isPrimary = false;

    // Custom personal info for CV Builder
    @Column(name="full_name")
    private String fullName;

    @Column(name="email")
    private String email;

    @Column(name="phone")
    private String phone;

    @Column(name="address")
    private String address;

    @Column(name="target_position")
    private String targetPosition;

    @Column(name="avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name="github_url")
    private String githubUrl;

    @Column(name="linkedin_url")
    private String linkedinUrl;

    @Column(name="dob")
    private String dob;

    @Column(name="gender")
    private String gender;

    @Column(name="hobbies", columnDefinition = "TEXT")
    private String hobbies;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Resume() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CandidateProfile getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(CandidateProfile candidateId) {
        this.candidateId = candidateId;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getCvName() {
        return cvName;
    }

    public void setCvName(String cvName) {
        this.cvName = cvName;
    }

    public String getParsedText() {
        return parsedText;
    }

    public void setParsedText(String parsedText) {
        this.parsedText = parsedText;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<ExperienceItemDTO> getExperiences() {
        return experiences;
    }

    public void setExperiences(List<ExperienceItemDTO> experiences) {
        this.experiences = experiences;
    }

    public List<EducationItemDTO> getEducationItemDTOS() {
        return educationItemDTOS;
    }

    public void setEducationItemDTOS(List<EducationItemDTO> educationItemDTOS) {
        this.educationItemDTOS = educationItemDTOS;
    }

    public List<ProjectItemDTO> getProjectItems() {
        return projectItems;
    }

    public void setProjectItems(List<ProjectItemDTO> projectItems) {
        this.projectItems = projectItems;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getTargetPosition() { return targetPosition; }
    public void setTargetPosition(String targetPosition) { this.targetPosition = targetPosition; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getHobbies() { return hobbies; }
    public void setHobbies(String hobbies) { this.hobbies = hobbies; }
}
