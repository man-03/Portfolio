package portfolio.service;

import org.springframework.stereotype.Service;
import portfolio.dto.ContactFormRequestDTO;

@Service
public class ContactFormService {

    private final EmailService emailService;

    public ContactFormService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void sendMessage(ContactFormRequestDTO request) {

        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Name is required");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }

        if (request.getMessage() == null || request.getMessage().isBlank()) {
            throw new RuntimeException("Message is required");
        }

        if (request.getMessage().length() > 3000) {
            throw new RuntimeException(
                    "Message must not exceed 3000 characters"
            );
        }

        emailService.sendContactFormEmail(
                request.getName(),
                request.getEmail(),
                request.getMessage()
        );
    }
}