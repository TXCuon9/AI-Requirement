package com.example.ai_requirement_be.entity.SkillManager;

import com.example.ai_requirement_be.entity.Job.JobSkill;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="skills")
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name" , updatable = true , nullable = false)
    private String name;

    @Column(name="category" , length = 100)
    private String category;

    @OneToMany(mappedBy = "skill", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<JobSkill> jobSkills = new ArrayList<>();

    public Skill() {

    }
    public Skill(Long id, String name, String category) {
        this.id = id;
        this.name = name;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<JobSkill> getJobSkills() {
        return jobSkills;
    }

    public void setJobSkills(List<JobSkill> jobSkills) {
        this.jobSkills = jobSkills;
    }
}
