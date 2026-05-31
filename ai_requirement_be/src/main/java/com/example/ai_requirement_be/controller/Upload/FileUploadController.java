package com.example.ai_requirement_be.controller.Upload;

import com.example.ai_requirement_be.entity.CandidateManager.FileUpload;
import com.example.ai_requirement_be.service.Upload.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.security.Principal;

@RestController
@RequestMapping("/api/file")
public class FileUploadController {
  private final FileUploadService fileUploadService;
  @Autowired
  public FileUploadController(FileUploadService fileUploadService) {
      this.fileUploadService = fileUploadService;
  }

  @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file ,  Principal principal) {
      try {
          if(principal == null) {
              return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                      .body("Bạn cần đăng nhập để thực hiện chức năng này!");
          }
          String email =  principal.getName();
          FileUpload savedFile = fileUploadService.storeLocalFile(file, email);
          return ResponseEntity.status(HttpStatus.CREATED).body(savedFile);
      }catch(IllegalArgumentException e) {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
      }catch(Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .body("Lỗi hệ thống trong quá trình xử lý file: " + e.getMessage());
      }
  }

  }

