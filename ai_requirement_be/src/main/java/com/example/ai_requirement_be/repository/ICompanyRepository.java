package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.CompaniesManager.Companies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ICompanyRepository extends JpaRepository<Companies , Long> {
}
