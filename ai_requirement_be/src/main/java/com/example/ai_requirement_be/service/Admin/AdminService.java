package com.example.ai_requirement_be.service.Admin;

import com.example.ai_requirement_be.dto.Admin.CompanyAdminDTO;
import com.example.ai_requirement_be.dto.Admin.JobAdminDTO;
import com.example.ai_requirement_be.dto.Admin.UserAdminDTO;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.entity.UserManager.UserStatus;
import com.example.ai_requirement_be.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.ai_requirement_be.dto.Admin.SeedJobDTO;
import com.example.ai_requirement_be.entity.CompaniesManager.Companies;
import com.example.ai_requirement_be.entity.RecruiterManager.JobDescription;
import com.example.ai_requirement_be.entity.RecruiterManager.JobType;
import com.example.ai_requirement_be.entity.RecruiterManager.RecruiterProfile;
import com.example.ai_requirement_be.repository.ICompanyRepository;
import com.example.ai_requirement_be.repository.IJobdepRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private final IUserRepository userRepository;
    private final ICompanyRepository companyRepository;
    private final IJobdepRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(IUserRepository userRepository, ICompanyRepository companyRepository, IJobdepRepository jobRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void approveCompany(Long userId) {
        User user =  userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản yêu cầu!"));
        if(user.getStatus() != UserStatus.PENDING) {
            throw new RuntimeException("Tài khoản này đã được kích hoạt hoặc không ở trạng thái chờ duyệt!");
        }
        user.setStatus(UserStatus.ACTIVE);
        
        if (user.getRole() == com.example.ai_requirement_be.entity.UserManager.UserRole.COMPANY && user.getCompanies() != null) {
            user.getCompanies().setVerified(true);
        }
        
        userRepository.save(user);
    }

    public com.example.ai_requirement_be.dto.Admin.AdminDashboardStatsDTO getDashboardStats(com.example.ai_requirement_be.repository.IJobdepRepository jobRepository) {
        long totalCompanies = userRepository.countByRole(com.example.ai_requirement_be.entity.UserManager.UserRole.COMPANY);
        long pendingCompanies = userRepository.countByRoleAndStatus(com.example.ai_requirement_be.entity.UserManager.UserRole.COMPANY, UserStatus.PENDING);
        long totalUsers = userRepository.count();
        long totalJobs = jobRepository.count();

        return new com.example.ai_requirement_be.dto.Admin.AdminDashboardStatsDTO(totalCompanies, pendingCompanies, totalUsers, totalJobs);
    }

    // --- USERS CRUD ---
    public List<UserAdminDTO> getAllUsers() {
        return userRepository.findAll().stream().map(user -> 
            new UserAdminDTO(user.getId(), user.getEmail(), user.getRole(), user.getStatus())
        ).collect(Collectors.toList());
    }

    @Transactional
    public void updateUser(Long id, UserAdminDTO dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        user.setRole(dto.getRole());
        user.setStatus(dto.getStatus());
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // --- COMPANIES CRUD ---
    public List<CompanyAdminDTO> getAllCompanies() {
        List<User> companies = userRepository.findByRole(com.example.ai_requirement_be.entity.UserManager.UserRole.COMPANY);
        return companies.stream().map(user -> {
            CompanyAdminDTO dto = new CompanyAdminDTO();
            dto.setId(user.getId()); // using User ID since companies are tied to users
            dto.setEmail(user.getEmail());
            dto.setStatus(user.getStatus());
            if (user.getCompanies() != null) {
                dto.setName(user.getCompanies().getName());
                dto.setIndustry(user.getCompanies().getIndustry());
                dto.setCompanySize(user.getCompanies().getCompanySize());
                dto.setLocation(user.getCompanies().getLocation());
                boolean isVerified = Boolean.TRUE.equals(user.getCompanies().getVerified()) || user.getStatus() == UserStatus.ACTIVE;
                dto.setVerified(isVerified);
            } else {
                dto.setName("Chưa cập nhật");
                dto.setVerified(user.getStatus() == UserStatus.ACTIVE);
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void updateCompany(Long id, CompanyAdminDTO dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy công ty"));
        if (user.getCompanies() != null) {
            Companies comp = user.getCompanies();
            comp.setName(dto.getName());
            comp.setIndustry(dto.getIndustry());
            comp.setCompanySize(dto.getCompanySize());
            comp.setLocation(dto.getLocation());
            comp.setVerified(dto.getVerified());
            companyRepository.save(comp);
        }
    }

    public void toggleCompanyStatus(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy công ty"));
        if (user.getStatus() == UserStatus.ACTIVE) {
            user.setStatus(UserStatus.INACTIVE);
        } else if (user.getStatus() == UserStatus.INACTIVE || user.getStatus() == UserStatus.PENDING) {
            user.setStatus(UserStatus.ACTIVE);
        }
        userRepository.save(user);
    }

    @Transactional
    public void deleteCompany(Long id) {
        // Deleting the user will cascade delete Companies, Jobs, and RecruiterProfiles
        userRepository.deleteById(id);
    }

    // --- JOBS CRUD ---
    public List<JobAdminDTO> getAllJobs() {
        return jobRepository.findAll().stream().map(job -> {
            String companyName = job.getCompany() != null ? job.getCompany().getName() : "Unknown";
            String industry = job.getCompany() != null ? job.getCompany().getIndustry() : "Unknown";
            return new JobAdminDTO(job.getId(), job.getTitle(), companyName, industry, job.getStatus());
        }).collect(Collectors.toList());
    }

    @Transactional
    public void updateJob(Long id, JobAdminDTO dto) {
        JobDescription job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy việc làm"));
        job.setTitle(dto.getTitle());
        job.setStatus(dto.getStatus());
        jobRepository.save(job);
    }

    @Transactional
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }


    @Transactional
    public void seedJobs(List<SeedJobDTO> dtos) {
        for (SeedJobDTO dto : dtos) {
            Companies company = companyRepository.findByName(dto.getCompanyName()).orElse(null);
            if (company == null) {
                User companyUser = new User();
                String emailPrefix = dto.getCompanyName().toLowerCase().replaceAll("[^a-z0-9]", "");
                companyUser.setEmail("contact@" + emailPrefix + ".com");
                if (userRepository.existsByEmail(companyUser.getEmail())) {
                    companyUser.setEmail("contact+" + System.currentTimeMillis() + "@" + emailPrefix + ".com");
                }
                companyUser.setPasswordHash(passwordEncoder.encode("123456"));
                companyUser.setRole(com.example.ai_requirement_be.entity.UserManager.UserRole.COMPANY);
                companyUser.setStatus(UserStatus.ACTIVE);

                company = new Companies();
                company.setName(dto.getCompanyName());
                company.setLogoUrl(dto.getCompanyLogoUrl());
                company.setDescription(dto.getCompanyDescription());
                company.setVerified(true);
                company.setUser(companyUser);
                companyUser.setCompanies(company);

                userRepository.save(companyUser);

                User recruiterUser = new User();
                recruiterUser.setEmail("hr@" + emailPrefix + ".com");
                if (userRepository.existsByEmail(recruiterUser.getEmail())) {
                    recruiterUser.setEmail("hr+" + System.currentTimeMillis() + "@" + emailPrefix + ".com");
                }
                recruiterUser.setPasswordHash(passwordEncoder.encode("123456"));
                recruiterUser.setRole(com.example.ai_requirement_be.entity.UserManager.UserRole.RECRUITER);
                recruiterUser.setStatus(UserStatus.ACTIVE);

                RecruiterProfile recruiterProfile = new RecruiterProfile();
                recruiterProfile.setCompany(company);
                recruiterProfile.setPosition("HR Manager");
                recruiterProfile.setCreatedAt(LocalDateTime.now());
                recruiterProfile.setUser(recruiterUser);
                recruiterUser.setRecruiterProfile(recruiterProfile);

                userRepository.save(recruiterUser);
            }

            JobDescription job = new JobDescription();
            job.setCompany(company);
            job.setTitle(dto.getJobTitle());
            job.setDescription(dto.getJobDescription());
            job.setRequirements(dto.getJobRequirement());
            String benefits = dto.getJobBenefit() != null ? dto.getJobBenefit() : "";
            job.setResponsibilities("Quyền lợi: " + benefits);
            job.setLocation(dto.getLocation());
            job.setJobType(JobType.FULL_TIME);
            job.setStatus(com.example.ai_requirement_be.entity.RecruiterManager.JobStatus.OPEN);
            
            try {
                if (dto.getSalary() != null && !dto.getSalary().isEmpty()) {
                    String cleanSalary = dto.getSalary().replaceAll("[^0-9\\-]", "");
                    if (cleanSalary.contains("-")) {
                        String[] parts = cleanSalary.split("-");
                        if (parts.length == 2 && !parts[0].isEmpty() && !parts[1].isEmpty()) {
                            job.setSalaryMin(new java.math.BigDecimal(parts[0].trim()));
                            job.setSalaryMax(new java.math.BigDecimal(parts[1].trim()));
                        }
                    } else if (!cleanSalary.isEmpty()) {
                        job.setSalaryMin(new java.math.BigDecimal(cleanSalary));
                        job.setSalaryMax(new java.math.BigDecimal(cleanSalary));
                    }
                }
            } catch (Exception e) {
            }

            jobRepository.save(job);
        }
    }

    @Transactional
    public int clearMockData() {
        List<User> mockUsers = userRepository.findAll().stream()
            .filter(u -> u.getEmail() != null && 
                (u.getEmail().startsWith("contact@") || u.getEmail().startsWith("contact+") || 
                 u.getEmail().startsWith("hr@") || u.getEmail().startsWith("hr+")))
            .collect(Collectors.toList());
        
        int count = mockUsers.size();
        userRepository.deleteAll(mockUsers);
        return count;
    }
}
