package portfolio.controller;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import portfolio.dto.AdminResumeResponseDTO;
import portfolio.model.AdminResume;
import portfolio.service.AdminResumeService;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin/{userName}/resume")
public class AdminResumeController {

    private final AdminResumeService adminResumeService;

    public AdminResumeController(
            AdminResumeService adminResumeService) {

        this.adminResumeService = adminResumeService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize(
            "@adminAuthorizationService.isAuthorized(authentication, #userName)"
    )
    public ResponseEntity<AdminResumeResponseDTO> uploadResume(
            @PathVariable String userName,
            @RequestParam("file") MultipartFile file)
            throws IOException {

        return ResponseEntity.ok(
                adminResumeService.uploadResume(userName, file)
        );
    }

    @GetMapping
    @PreAuthorize(
            "@adminAuthorizationService.isAuthorized(authentication, #userName)"
    )
    public ResponseEntity<AdminResumeResponseDTO> getResume(
            @PathVariable String userName) {

        return ResponseEntity.ok(
                adminResumeService.getResume(userName)
        );
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize(
            "@adminAuthorizationService.isAuthorized(authentication, #userName)"
    )
    public ResponseEntity<AdminResumeResponseDTO> updateResume(
            @PathVariable String userName,
            @RequestParam("file") MultipartFile file)
            throws IOException {

        return ResponseEntity.ok(
                adminResumeService.updateResume(userName, file)
        );
    }

    @DeleteMapping
    @PreAuthorize(
            "@adminAuthorizationService.isAuthorized(authentication, #userName)"
    )
    public ResponseEntity<String> deleteResume(
            @PathVariable String userName) {

        adminResumeService.deleteResume(userName);

        return ResponseEntity.ok(
                "Resume deleted successfully."
        );
    }

    @GetMapping("/file")
    @PreAuthorize(
            "@adminAuthorizationService.isAuthorized(authentication, #userName)"
    )
    public ResponseEntity<ByteArrayResource> viewResume(
            @PathVariable String userName) {

        AdminResume adminResume =
                adminResumeService.getResumeFile(userName);

        ByteArrayResource resource =
                new ByteArrayResource(adminResume.getFileData());

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                adminResume.getContentType()
                        )
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                adminResume.getFileName() + "\""
                )
                .contentLength(adminResume.getFileSize())
                .body(resource);
    }
}