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

    public void sendInterviewRejectionEmail(
            String toEmail,
            String candidateName,
            String companyName
    ) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Thông báo kết quả phỏng vấn" + companyName);
        message.setText(
                "Chào " + candidateName + ",\n\n"
                        + "Cảm ơn bạn đã quan tâm và dành thời gian ứng tuyển, cũng như tham gia phỏng vấn tại "
                        + companyName + ".\n\n"
                        + "Chúng tôi đánh giá rất cao năng lực và kinh nghiệm của bạn. Tuy nhiên, sau khi cân nhắc kỹ lưỡng, "
                        + "chúng tôi rất tiếc phải thông báo rằng ở thời điểm hiện tại, chúng tôi đã quyết định chọn một ứng viên khác "
                        + "phù hợp hơn với định hướng của vị trí này.\n\n"
                        + "Chúng tôi sẽ tiếp tục lưu trữ hồ sơ của bạn trong hệ thống và rất mong có cơ hội được hợp tác "
                        + "với bạn ở những cơ hội nghề nghiệp khác trong tương lai.\n\n"
                        + "Chúc bạn nhiều sức khỏe và luôn thành công trên con đường sự nghiệp.\n\n"
                        + "Trân trọng,\n"
                        + companyName
        );
        mailSender.send(message);
    }

}
