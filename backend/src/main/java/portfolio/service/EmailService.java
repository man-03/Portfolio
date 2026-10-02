package portfolio.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(
            String toEmail,
            String resetLink) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("immanoj312@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Password Reset - Portfolio");

        message.setText(
                "Hello,\n\n" +
                        "We received a request to reset your password.\n\n" +
                        "Click the link below to reset your password:\n" +
                        resetLink + "\n\n" +
                        "This link will expire in 15 minutes.\n\n" +
                        "If you did not request this, you can safely ignore this email.\n\n" +
                        "Regards,\n" +
                        "Portfolio"
        );

        mailSender.send(message);
    }
}