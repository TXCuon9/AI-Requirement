package com.example.ai_requirement_be.service.Email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.text.NumberFormat;
import java.util.Locale;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromEmail;

    public EmailService(JavaMailSender mailSender,
                        @Value("${spring.mail.username}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    private boolean isVietnamese(String text) {
        return StringUtils.hasText(text)
                && text.matches(".*[ăâđêôơưĂÂĐÊÔƠƯ].*");
    }

    private String valueOr(String value, String fallback) {
        return StringUtils.hasText(value) ? value.trim() : fallback;
    }

    private String formatCurrency(Double amount) {
        if (amount == null || amount <= 0) return "Thỏa thuận / Negotiable";
        return NumberFormat.getCurrencyInstance(new Locale("vi", "VN")).format(amount);
    }

    @Async
    public void sendEmail(String toEmail, String candidateName, String companyName, String jobTitle) {
        String name = valueOr(candidateName, "Bạn");
        String company = valueOr(companyName, "đội ngũ tuyển dụng");
        String role = valueOr(jobTitle, "vị trí ứng tuyển");

        if (isVietnamese(jobTitle)) {
            sendSimpleMail(toEmail,
                    String.format("[%s] Đã nhận hồ sơ ứng tuyển – %s", company, role),
                    "Kính gửi " + name + ",\n\n"
                            + "Cảm ơn bạn đã quan tâm và gửi hồ sơ cho vị trí " + role + " tại " + company + ".\n\n"
                            + "Chúng tôi xác nhận hồ sơ của bạn đã được tiếp nhận thành công. Đội ngũ tuyển dụng sẽ xem xét kỹ năng và kinh nghiệm của bạn theo các tiêu chí của vị trí.\n\n"
                            + "Nếu hồ sơ phù hợp với nhu cầu hiện tại, chúng tôi sẽ liên hệ để trao đổi về các bước tiếp theo.\n\n"
                            + "Trân trọng,\nĐội ngũ Tuyển dụng " + company);
        } else {
            sendSimpleMail(toEmail,
                    String.format("[%s] Application received – %s", company, role),
                    "Dear " + name + ",\n\n"
                            + "Thank you for your interest in the " + role + " opportunity at " + company + ".\n\n"
                            + "This is to confirm that we have received your application successfully. Our recruiting team will review your experience and qualifications against the requirements of the role.\n\n"
                            + "If your profile is a strong match for our current needs, we will contact you to discuss the next steps.\n\n"
                            + "Best regards,\nThe " + company + " Recruiting Team");
        }
    }

    @Async
    public void sendInterviewInvitationEmail(String toEmail, String candidateName,
                                              String companyName, String jobTitle,
                                              Double salary, String contractDate, String startDate) {
        String name = valueOr(candidateName, "Bạn");
        String company = valueOr(companyName, "đội ngũ tuyển dụng");
        String role = valueOr(jobTitle, "vị trí ứng tuyển");
        String interviewDate = valueOr(contractDate, "Sẽ được trao đổi khi xác nhận lịch");
        String expectedStartDate = valueOr(startDate, "Sẽ được trao đổi trong buổi phỏng vấn");
        String compensation = formatCurrency(salary);

        if (isVietnamese(jobTitle)) {
            sendSimpleMail(toEmail,
                    String.format("[%s] Thư mời phỏng vấn – %s", company, role),
                    "Kính gửi " + name + ",\n\n"
                            + "Sau khi xem xét hồ sơ, chúng tôi ấn tượng với kinh nghiệm của bạn và trân trọng mời bạn tham gia phỏng vấn cho vị trí " + role + " tại " + company + ".\n\n"
                            + "Thông tin dự kiến:\n"
                            + "• Mức lương: " + compensation + "\n"
                            + "• Thời gian phỏng vấn: " + interviewDate + "\n"
                            + "• Thời gian bắt đầu dự kiến: " + expectedStartDate + "\n\n"
                            + "Vui lòng phản hồi email này để xác nhận khả năng tham dự. Nếu thời gian trên chưa phù hợp, bạn có thể đề xuất một khung giờ khác.\n\n"
                            + "Chúng tôi mong được trao đổi thêm với bạn.\n\n"
                            + "Trân trọng,\nĐội ngũ Tuyển dụng " + company);
        } else {
            sendSimpleMail(toEmail,
                    String.format("[%s] Interview invitation – %s", company, role),
                    "Dear " + name + ",\n\n"
                            + "After reviewing your application, we were impressed by your experience and would like to invite you to interview for the " + role + " position at " + company + ".\n\n"
                            + "Proposed details:\n"
                            + "• Compensation: " + compensation + "\n"
                            + "• Interview date: " + interviewDate + "\n"
                            + "• Expected start date: " + expectedStartDate + "\n\n"
                            + "Please reply to confirm your availability. If the proposed timing does not work for you, feel free to suggest an alternative.\n\n"
                            + "We look forward to speaking with you.\n\n"
                            + "Best regards,\nThe " + company + " Recruiting Team");
        }
    }

    @Async
    public void sendInterviewRejectionEmail(String toEmail, String candidateName,
                                             String companyName, String jobTitle) {
        String name = valueOr(candidateName, "Bạn");
        String company = valueOr(companyName, "đội ngũ tuyển dụng");
        String role = valueOr(jobTitle, "vị trí ứng tuyển");

        if (isVietnamese(jobTitle)) {
            sendSimpleMail(toEmail,
                    String.format("[%s] Cập nhật kết quả ứng tuyển – %s", company, role),
                    "Kính gửi " + name + ",\n\n"
                            + "Cảm ơn bạn đã dành thời gian ứng tuyển cho vị trí " + role + " tại " + company + ".\n\n"
                            + "Sau quá trình xem xét, chúng tôi rất tiếc phải thông báo rằng hồ sơ của bạn chưa được lựa chọn cho vị trí này ở thời điểm hiện tại. Quyết định này phản ánh mức độ phù hợp với nhu cầu cụ thể của vai trò, không phải đánh giá tổng thể về năng lực của bạn.\n\n"
                            + "Chúng tôi trân trọng sự quan tâm của bạn và hy vọng sẽ có cơ hội được kết nối với bạn trong tương lai.\n\n"
                            + "Chúc bạn thành công trong hành trình nghề nghiệp.\n\n"
                            + "Trân trọng,\nĐội ngũ Tuyển dụng " + company);
        } else {
            sendSimpleMail(toEmail,
                    String.format("[%s] Application update – %s", company, role),
                    "Dear " + name + ",\n\n"
                            + "Thank you for taking the time to apply for the " + role + " position at " + company + ".\n\n"
                            + "After careful consideration, we regret to let you know that we will not be moving forward with your application for this role at this time. This decision reflects the specific requirements of the position and is not a judgment of your overall capabilities.\n\n"
                            + "We appreciate your interest and hope to have the opportunity to connect with you about a future role.\n\n"
                            + "We wish you continued success in your career.\n\n"
                            + "Best regards,\nThe " + company + " Recruiting Team");
        }
    }

    private void sendSimpleMail(String toEmail, String subject, String text) {
        if (!StringUtils.hasText(toEmail)) {
            logger.warn("Skip email: recipient is null or blank");
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail.trim());
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            logger.info("Email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", toEmail, e.getMessage(), e);
        }
    }
}
