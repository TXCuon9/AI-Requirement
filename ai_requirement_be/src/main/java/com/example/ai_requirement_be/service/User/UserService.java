package com.example.ai_requirement_be.service.User;

import com.example.ai_requirement_be.dto.User.UserPendingResponseDTO;
import com.example.ai_requirement_be.entity.UserManager.User;
import com.example.ai_requirement_be.entity.UserManager.UserStatus;
import com.example.ai_requirement_be.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final IUserRepository userRepository;
    @Autowired
    public  UserService(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserPendingResponseDTO> findAllPendingUsers() {
       List<User> pendingUsers = userRepository.findByStatus(UserStatus.PENDING);

       return pendingUsers.stream().map(user -> new UserPendingResponseDTO(
               user.getEmail(),
               user.getRole(),
               user.getProvider(),
               user.getStatus(),
               user.getCreatedAt(),
               user.getUpdatedAt()
       )).collect(Collectors.toList());
    }
}
