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
            String companyName,
            String title,
            Double salary,
            String contractDate,
            String startDate
    ) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Chúc mừng bạn đã trúng tuyển" + companyName);
        message.setText(
                "Chào " + candidateName + ",\n\n"
                        + companyName + " cảm ơn bạn đã quan tâm và ứng tuyển vào vị trí "
                        + title + " tại công ty chúng tôi.\n\n"
                        + "Sau khi xem xét hồ sơ, chúng tôi đánh giá cao kiến thức, kinh nghiệm "
                        + "cũng như những kỹ năng mà bạn đã thể hiện và trân trọng mời bạn tham gia "
                        + "buổi phỏng vấn để trao đổi chi tiết hơn về vị trí công việc.\n\n"
                        + "Buổi phỏng vấn dự kiến sẽ diễn ra vào ngày " + contractDate
                        + ". Trong buổi phỏng vấn, chúng tôi sẽ trao đổi thêm về công việc, "
                        + "môi trường làm việc cũng như các thông tin liên quan đến chế độ đãi ngộ, "
                        + "bao gồm mức lương dự kiến là " + salary + ".\n\n"
                        + "Nếu bạn phù hợp và vượt qua vòng phỏng vấn, thời gian dự kiến bắt đầu công việc sẽ từ ngày "
                        + startDate + ".\n\n"
                        + "Bạn vui lòng phản hồi lại email này để xác nhận tham gia phỏng vấn "
                        + "hoặc liên hệ với chúng tôi nếu cần thêm bất kỳ thông tin nào.\n\n"
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
        message.setSubject("Thông báo kết quả phỏng vấn " + companyName);
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

    public void sendEmail(String toEmail, String candidateName, String companyName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Gửi gmail thành công: " + companyName);
        message.setText(
                "Kính gửi " + candidateName + ",\n\n"
                        + "Cảm ơn bạn đã quan tâm và nộp hồ sơ ứng tuyển vào " + companyName + ". "
                        + "Chúng tôi xin xác nhận rằng hồ sơ của bạn đã được ghi nhận thành công "
                        + "trên hệ thống.\n\n"
                        + "Bộ phận Tuyển dụng sẽ xem xét hồ sơ và liên hệ với bạn trong thời gian sớm nhất "
                        + "nếu hồ sơ phù hợp với vị trí tuyển dụng.\n\n"
                        + "Chúc bạn một ngày làm việc hiệu quả.\n\n"
                        + "Trân trọng,\n"
                        + companyName
        );
        mailSender.send(message);
    }
}
