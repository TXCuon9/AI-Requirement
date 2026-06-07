package com.example.ai_requirement_be.entity.Job;

import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.SkillManager.Skill;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name="job_skills")
public class JobSkill {
   @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="job_id")
    private JobDescription jobDescription;

   @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="skill_id" , nullable = false)
    private Skill skill;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "required_level")
    private JobSkillsRequiredLevelEnum requiredLevel;

    @Column(name = "weight")
    private Integer weight = 1;

    @Column(name = "mandatory")
    private Boolean mandatory = false;

    public JobSkill() {}

    public JobSkill(Long id, JobDescription jobDescription, Skill skill, JobSkillsRequiredLevelEnum requiredLevel, Integer weight, Boolean mandatory) {
        this.id = id;
        this.jobDescription = jobDescription;
        this.skill = skill;
        this.requiredLevel = requiredLevel;
        this.weight = weight;
        this.mandatory = mandatory;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JobDescription getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(JobDescription jobDescription) {
        this.jobDescription = jobDescription;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public JobSkillsRequiredLevelEnum getRequiredLevel() {
        return requiredLevel;
    }

    public void setRequiredLevel(JobSkillsRequiredLevelEnum requiredLevel) {
        this.requiredLevel = requiredLevel;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public Boolean getMandatory() {
        return mandatory;
    }

    public void setMandatory(Boolean mandatory) {
        this.mandatory = mandatory;
    }
}
