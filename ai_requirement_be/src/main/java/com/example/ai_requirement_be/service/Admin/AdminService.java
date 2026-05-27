package com.example.ai_requirement_be.service.Admin;

import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.entity.UserManager.UserStatus;
import com.example.ai_requirement_be.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private final IUserRepository userRepository;

    @Autowired
    public AdminService(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void approveCompany(Long userId) {

        User user =  userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản yêu cầu!"));
        if(user.getStatus() != UserStatus.PENDING) {
            throw new RuntimeException("Tài khoản này đã được kích hoạt hoặc không ở trạng thái chờ duyệt!");
        }

        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }

}
