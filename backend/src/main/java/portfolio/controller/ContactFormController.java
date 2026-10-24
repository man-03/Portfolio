package portfolio.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import portfolio.dto.ContactFormRequestDTO;
import portfolio.service.ContactFormService;
import portfolio.utls.ApiResponse;

@RestController
@RequestMapping("/api/public/contact")
public class ContactFormController {

    private final ContactFormService contactFormService;

    public ContactFormController(ContactFormService contactFormService) {
        this.contactFormService = contactFormService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> sendMessage(@RequestParam String userName, @RequestBody ContactFormRequestDTO request) {

        contactFormService.sendMessage(userName, request);

        return ResponseEntity.ok(
                new ApiResponse("true", "Query sent successfully.")
        );
    }
}