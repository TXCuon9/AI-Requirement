package com.example.ai_requirement_be.config;

import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.entity.UserManager.UserRole;
import com.example.ai_requirement_be.repository.IUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(IUserRepository userRepository, PasswordEncoder passwordEncoder, JdbcTemplate jdbcTemplate) {
        return args -> {
            // Fix PostgreSQL ENUM issues automatically
            try {
                jdbcTemplate.execute("ALTER TYPE users_role_enum ADD VALUE IF NOT EXISTS 'COMPANY'");
                System.out.println("✅ Đã cập nhật users_role_enum thêm COMPANY");
            } catch (Exception e) {
                // Ignore if it already exists or other minor errors
            }

            try {
                jdbcTemplate.execute("ALTER TYPE users_status_enum ADD VALUE IF NOT EXISTS 'PENDING'");
                System.out.println("✅ Đã cập nhật users_status_enum thêm PENDING");
            } catch (Exception e) {
            }

            String adminEmail = "admin@gmail.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User(
                        adminEmail,
                        passwordEncoder.encode("admin123"),
                        UserRole.ADMIN
                );
                userRepository.save(admin);
            }
        };
    }
}
