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
                        + "Trước hết, " + companyName + " xin chúc mừng bạn đã xuất sắc vượt qua "
                        + "các vòng phỏng vấn và chính thức trúng tuyển vào vị trí "
                        + title + " tại công ty.\n\n"
                        + "Chúng tôi rất ấn tượng với kiến thức chuyên môn, kinh nghiệm làm việc "
                        + "cũng như những kỹ năng bạn đã thể hiện trong quá trình tuyển dụng.\n\n"
                        + "Theo nội dung đã trao đổi, mức lương khởi điểm dành cho bạn là "
                        + salary + ", đã bao gồm các chế độ bảo hiểm theo quy định. "
                        + "Ngoài ra, bạn sẽ được hưởng đầy đủ các phúc lợi, chế độ thưởng, "
                        + "nghỉ phép, lễ tết và tham gia các chương trình đào tạo của công ty.\n\n"
                        + "Trong trường hợp bạn đồng ý, hai bên sẽ tiến hành ký hợp đồng vào ngày "
                        + contractDate + " và bạn có thể bắt đầu công việc từ ngày "
                        + startDate + ".\n\n"
                        + "Nếu có bất kỳ thắc mắc nào, bạn vui lòng phản hồi lại email này "
                        + "để được hỗ trợ.\n\n"
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
