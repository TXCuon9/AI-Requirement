package com.example.ai_requirement_be.service.Email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.text.NumberFormat;
import java.util.Locale;

@Service
public class EmailService {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;

    private boolean isVietnamese(String text) {
        if (text == null || text.trim().isEmpty()) return true;
        return text.matches(".*[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ].*");
    }

    private String formatCurrency(Double amount) {
        if (amount == null) return "Thỏa thuận / Negotiable";
        NumberFormat format = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return format.format(amount);
    }

    @Async
    public void sendEmail(String toEmail, String candidateName, String companyName, String jobTitle) {
        boolean isVn = isVietnamese(jobTitle);
        String subject = isVn 
            ? String.format("[%s] Xác nhận nộp đơn ứng tuyển thành công - %s", companyName, jobTitle)
            : String.format("[%s] Application Received - %s", companyName, jobTitle);
            
        String body = isVn
            ? String.format("Thân gửi %s,\n\n" +
              "Cảm ơn bạn đã quan tâm và ứng tuyển cho vị trí %s tại %s.\n\n" +
              "Chúng tôi xin xác nhận đã nhận được hồ sơ của bạn thành công trên hệ thống. " +
              "Đội ngũ Tuyển dụng của chúng tôi sẽ xem xét kỹ lưỡng hồ sơ và đối chiếu với các yêu cầu của vị trí này. " +
              "Nếu hồ sơ của bạn phù hợp, chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để trao đổi về các bước tiếp theo.\n\n" +
              "Trong thời gian chờ đợi, bạn có thể tìm hiểu thêm về văn hóa và các hoạt động của %s tại website của chúng tôi.\n\n" +
              "Chúc bạn một ngày tuyệt vời!\n\n" +
              "Trân trọng,\nĐội ngũ Tuyển dụng %s", candidateName, jobTitle, companyName, companyName, companyName)
            : String.format("Dear %s,\n\n" +
              "Thank you for your interest and for applying for the %s position at %s.\n\n" +
              "We are writing to confirm that we have successfully received your application. " +
              "Our Recruiting team will carefully review your background and experience to determine if there is a strong match for this role. " +
              "If your qualifications align with our current needs, we will reach out to you shortly to discuss the next steps.\n\n" +
              "In the meantime, feel free to learn more about our culture and work at %s by visiting our website.\n\n" +
              "Have a great day!\n\n" +
              "Best regards,\n%s Recruiting Team", candidateName, jobTitle, companyName, companyName, companyName);

        sendSimpleMail(toEmail, subject, body);
    }

    @Async
    public void sendInterviewInvitationEmail(
            String toEmail, String candidateName, String companyName,
            String jobTitle, Double salary, String contractDate, String startDate) {
        boolean isVn = isVietnamese(jobTitle);
        String formattedSalary = formatCurrency(salary);
        
        String subject = isVn
            ? String.format("[%s] Thư mời phỏng vấn - Vị trí %s", companyName, jobTitle)
            : String.format("[%s] Interview Invitation - %s", companyName, jobTitle);

        String body = isVn
            ? String.format("Thân gửi %s,\n\n" +
              "Cảm ơn bạn đã quan tâm và ứng tuyển cho vị trí %s tại %s.\n\n" +
              "Sau khi xem xét cẩn thận hồ sơ của bạn, chúng tôi rất ấn tượng với kinh nghiệm cũng như kỹ năng mà bạn sở hữu. " +
              "Chúng tôi trân trọng kính mời bạn tham gia buổi phỏng vấn sắp tới để trao đổi chi tiết hơn về cơ hội nghề nghiệp này.\n\n" +
              "Thông tin sơ bộ về vị trí:\n" +
              "- Vị trí: %s\n" +
              "- Mức lương dự kiến: %s\n" +
              "- Ngày phỏng vấn dự kiến: %s\n" +
              "- Ngày có thể bắt đầu làm việc (dự kiến): %s\n\n" +
              "Vui lòng phản hồi lại email này để xác nhận sự tham gia của bạn hoặc đề xuất một khung thời gian phỏng vấn phù hợp hơn. " +
              "Đội ngũ tuyển dụng sẽ gửi lại thông tin chi tiết ngay sau khi nhận được phản hồi từ bạn.\n\n" +
              "Chúng tôi rất mong chờ được trò chuyện và tìm hiểu thêm về bạn.\n\n" +
              "Trân trọng,\nĐội ngũ Tuyển dụng %s", candidateName, jobTitle, companyName, jobTitle, formattedSalary, contractDate, startDate, companyName)
            : String.format("Dear %s,\n\n" +
              "Thank you for applying for the %s position at %s.\n\n" +
              "After carefully reviewing your application, we were very impressed by your background and experience. " +
              "We would like to formally invite you to an interview to discuss this exciting career opportunity in more detail.\n\n" +
              "Preliminary details:\n" +
              "- Role: %s\n" +
              "- Estimated compensation: %s\n" +
              "- Proposed interview date: %s\n" +
              "- Expected start date: %s\n\n" +
              "Please reply to this email to confirm your availability or to suggest an alternative time that works best for you. " +
              "Once confirmed, our recruiting team will follow up with the exact schedule and interview format.\n\n" +
              "We look forward to speaking with you soon.\n\n" +
              "Best regards,\n%s Recruiting Team", candidateName, jobTitle, companyName, jobTitle, formattedSalary, contractDate, startDate, companyName);

        sendSimpleMail(toEmail, subject, body);
    }

    @Async
    public void sendInterviewRejectionEmail(String toEmail, String candidateName, String companyName, String jobTitle) {
        boolean isVn = isVietnamese(jobTitle);
        String subject = isVn
            ? String.format("[%s] Cập nhật kết quả ứng tuyển - %s", companyName, jobTitle)
            : String.format("[%s] Application Update - %s", companyName, jobTitle);

        String body = isVn
            ? String.format("Thân gửi %s,\n\n" +
              "Cảm ơn bạn đã dành thời gian ứng tuyển cho vị trí %s tại %s.\n\n" +
              "Chúng tôi đánh giá rất cao sự quan tâm của bạn đối với công ty cũng như những kinh nghiệm và kỹ năng bạn đã thể hiện. " +
              "Tuy nhiên, sau khi cân nhắc kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng ở thời điểm hiện tại, chúng tôi đã quyết định " +
              "tiếp tục với các ứng viên khác có định hướng phù hợp hơn với nhu cầu hiện tại của vị trí này.\n\n" +
              "Quyết định này không phản ánh năng lực thực sự của bạn, mà chỉ dựa trên sự phù hợp với yêu cầu cụ thể của đội ngũ trong giai đoạn này. " +
              "Chúng tôi sẽ lưu trữ hồ sơ của bạn trên hệ thống và rất hy vọng sẽ có cơ hội hợp tác với bạn ở một vị trí khác trong tương lai.\n\n" +
              "Chúc bạn luôn giữ vững nhiệt huyết và gặt hái nhiều thành công trên con đường sự nghiệp phía trước.\n\n" +
              "Trân trọng,\nĐội ngũ Tuyển dụng %s", candidateName, jobTitle, companyName, companyName)
            : String.format("Dear %s,\n\n" +
              "Thank you for taking the time to apply for the %s position at %s.\n\n" +
              "We deeply appreciate your interest in joining our team and the opportunity to learn about your background. " +
              "However, after careful consideration, we regret to inform you that we have decided to move forward with other candidates " +
              "whose profiles more closely align with our current needs for this specific role.\n\n" +
              "Please know that this decision does not reflect your abilities, but rather the specific requirements of our team at this time. " +
              "We will keep your resume on file and sincerely hope to have the opportunity to work with you in the future when a suitable position opens up.\n\n" +
              "We wish you the very best of luck in your job search and in all your future professional endeavors.\n\n" +
              "Best regards,\n%s Recruiting Team", candidateName, jobTitle, companyName, companyName);

        sendSimpleMail(toEmail, subject, body);
    }

    private void sendSimpleMail(String toEmail, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            logger.info("Email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", toEmail, e.getMessage(), e);
        }
    }
}
