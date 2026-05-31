package com.example.ai_requirement_be.repository;

import com.example.ai_requirement_be.entity.CandidateManager.FileUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface  IFileUploadRepository  extends JpaRepository<FileUpload,Long> {
}
