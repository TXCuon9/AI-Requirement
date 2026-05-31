package com.example.ai_requirement_be.entity.CandidateManager;

import com.example.ai_requirement_be.dto.Candidate.EducationItemDTO;
import com.example.ai_requirement_be.dto.Candidate.ExperienceItemDTO;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
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
    private CandidateProfile candidateId;


    @Column(name="file_url" , nullable = false , columnDefinition = "TEXT")
    private String fileUrl;

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

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
