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

        message.setFrom("quickfolio.app@gmail.com");
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

    public void sendContactFormEmail(
            String name,
            String email,
            String message) {

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setFrom("quickfolio.app@gmail.com");
        mailMessage.setTo("immanoj312@gmail.com");
        mailMessage.setSubject("New Portfolio Contact Message");

        mailMessage.setText(
                "New message received from your portfolio.\n\n" +
                        "Name: " + name + "\n" +
                        "Email: " + email + "\n\n" +
                        "Message:\n" +
                        message
        );

        mailSender.send(mailMessage);
    }
}