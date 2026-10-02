package portfolio.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import portfolio.dto.ContactFormRequestDTO;
import portfolio.service.ContactFormService;

@RestController
@RequestMapping("/api/public/contact")
public class ContactFormController {

    private final ContactFormService contactFormService;

    public ContactFormController(ContactFormService contactFormService) {
        this.contactFormService = contactFormService;
    }

    @PostMapping
    public ResponseEntity<String> sendMessage(
            @RequestBody ContactFormRequestDTO request) {

        contactFormService.sendMessage(request);

        return ResponseEntity.ok("Message sent successfully.");
    }
}