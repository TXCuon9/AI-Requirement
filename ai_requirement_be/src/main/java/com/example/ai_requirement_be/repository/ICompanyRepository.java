package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.CompaniesManager.Companies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ICompanyRepository extends JpaRepository<Companies , Long> {
    Optional<Companies> findByUserId(long id);

    @Query("SELECT c FROM Companies c WHERE " +
            "(LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
            "(LOWER(c.industry) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
            "(LOWER(c.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Companies> searchCompaniesByKeyword(@Param("keyword") String keyword);
}
