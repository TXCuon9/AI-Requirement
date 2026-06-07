package com.example.ai_requirement_be.service.Email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    public void sendInterviewInvitationEmail(
            String toEmail,
            String candidateName,
            String companyName
    ) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Thư Mời Phỏng Vấn từ " + companyName);
        message.setText(
                "Chào " + candidateName + ",\n\n"
                        + "Chúc mừng bạn! Hồ sơ của bạn đã vượt qua vòng sơ loại và "
                        + "chúng tôi muốn mời bạn tham gia vòng phỏng vấn tại "
                        + companyName + ".\n\n"
                        + "Vui lòng kiểm tra hệ thống hoặc phản hồi lại email này "
                        + "để xác nhận lịch phỏng vấn.\n\n"
                        + "Trân trọng,\n"
                        + companyName
        );
        mailSender.send(message);
    }
}
