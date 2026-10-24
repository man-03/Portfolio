package portfolio.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import portfolio.dto.ContactFormRequestDTO;
import portfolio.model.Admin;
import portfolio.model.AdminContactSubmission;
import portfolio.repository.AdminContactSubmissionRepository;
import portfolio.repository.AdminRepository;

@Service
public class ContactFormService {

    private final EmailService emailService;
    private final AdminContactSubmissionRepository contactRepository;
    private final AdminRepository adminRepository;

    public ContactFormService(
            EmailService emailService,
            AdminContactSubmissionRepository contactRepository,
            AdminRepository adminRepository) {
        this.emailService = emailService;
        this.contactRepository = contactRepository;
        this.adminRepository = adminRepository;
    }

    @Transactional
    public void sendMessage(String userName, ContactFormRequestDTO request) {

        Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
                .orElseThrow(() -> new RuntimeException("Admin Not Found"));

        AdminContactSubmission submission = new AdminContactSubmission();
        submission.setAdmin(admin);
        submission.setName(request.getName().trim());
        submission.setEmail(request.getEmail().trim());
        submission.setMessage(request.getMessage().trim());

        contactRepository.save(submission);

        emailService.sendContactFormEmail(
                submission.getName(),
                submission.getEmail(),
                submission.getMessage()
        );
    }
}