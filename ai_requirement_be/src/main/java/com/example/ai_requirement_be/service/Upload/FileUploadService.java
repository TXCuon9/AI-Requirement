package com.example.ai_requirement_be.service.Upload;

import com.example.ai_requirement_be.entity.CandidateManager.FileUpload;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.repository.IFileUploadRepository;
import com.example.ai_requirement_be.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
@Service
public class FileUploadService {
    private final IFileUploadRepository fileUploadRepository;
    private final IUserRepository userRepository;
    private final Path rootLocation;

    // Định dạng các MiMe type được phép (PDF và DOCX)
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    public FileUploadService(IFileUploadRepository fileUploadRepository, IUserRepository userRepository , @Value("${file.upload-dir:uploads}") String uploadDir) {
        this.fileUploadRepository = fileUploadRepository;
        this.userRepository = userRepository;
        this.rootLocation = Paths.get(uploadDir);

        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Không thể khởi tạo thư mục lưu file cục bộ!", e);
        }
    }

    public FileUpload storeLocalFile(MultipartFile file , String username) {
        // Kiểm tra xem User tồn tại không trước
        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("Không tìm thấy User với ID: " ));

        if(file.isEmpty()) {
            throw new IllegalArgumentException("File trống, vui lòng chọn file hợp lệ!");
        }

        if(file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Kích thước file vượt quá giới hạn cho phép (Tối đa 5MB)!");
        }
        // Kiểm tra định dạng file -> chỉ nhận PDF , DOCX
        String contentType = file.getContentType();
        if(contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Định dạng file không hợp lệ! Hệ thống chỉ chấp nhận file PDF hoặc DOCX.");
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String storedFilename = UUID.randomUUID().toString() + fileExtension;
            Path destinationFile = this.rootLocation.resolve(Paths.get(storedFilename)).normalize();

            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/api/files/view/" + storedFilename;

            FileUpload fileUpload = new FileUpload();
            fileUpload.setUser(user);
            fileUpload.setFileName(originalFilename);
            fileUpload.setFileUrl(fileUrl);
            fileUpload.setMimeType(contentType);
            fileUpload.setSize(file.getSize());

            return fileUploadRepository.save(fileUpload);
        } catch (IOException e) {
            throw new RuntimeException("Gặp lỗi khi lưu file vào hệ thống đĩa cứng!", e);
        }

    }
}
