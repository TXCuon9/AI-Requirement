package com.example.ai_requirement_be.entity.RecruiterManager;

import jakarta.persistence.*;

@Entity
@Table(name="recruiter_profiles")
public class RecruiterProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


}
