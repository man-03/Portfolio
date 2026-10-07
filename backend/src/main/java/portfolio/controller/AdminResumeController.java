package portfolio.controller;

import java.io.IOException;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import portfolio.dto.AdminResumeResponseDTO;
import portfolio.model.AdminResume;
import portfolio.service.AdminResumeService;

@RestController
@RequestMapping("/api/admin")
public class AdminResumeController {

    private final AdminResumeService adminResumeService;

    public AdminResumeController(AdminResumeService adminResumeService) {
        this.adminResumeService = adminResumeService;
    }

    @PostMapping(
            value = "/{userName}/resume",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("@adminAuthorizationService.isAuthorized(authentication, #userName)")
    public ResponseEntity<AdminResumeResponseDTO> uploadResume(
            @PathVariable String userName,
            @RequestParam("file") MultipartFile file)
            throws IOException {

        return ResponseEntity.ok(
                adminResumeService.uploadResume(userName, file)
        );
    }

    @GetMapping("/{userName}/resume")
    @PreAuthorize("@adminAuthorizationService.isAuthorized(authentication, #userName)")
    public ResponseEntity<AdminResumeResponseDTO> getResume(
            @PathVariable String userName) {

        return ResponseEntity.ok(
                adminResumeService.getResume(userName)
        );
    }

    @PutMapping(
            value = "/{userName}/resume/{resumeId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("@adminAuthorizationService.isAuthorized(authentication, #userName)")
    public ResponseEntity<AdminResumeResponseDTO> updateResume(
            @PathVariable String userName,
            @PathVariable Long resumeId,
            @RequestParam("file") MultipartFile file)
            throws IOException {

        return ResponseEntity.ok(
                adminResumeService.updateResume(
                        userName,
                        resumeId,
                        file
                )
        );
    }

    @DeleteMapping("/{userName}/resume/{resumeId}")
    @PreAuthorize("@adminAuthorizationService.isAuthorized(authentication, #userName)")
    public ResponseEntity<String> deleteResume(
            @PathVariable String userName,
            @PathVariable Long resumeId) {

        adminResumeService.deleteResume(userName, resumeId);

        return ResponseEntity.ok(
                "Resume deleted successfully."
        );
    }

    @GetMapping("/{userName}/resume/{resumeId}/file")
    @PreAuthorize("@adminAuthorizationService.isAuthorized(authentication, #userName)")
    public ResponseEntity<ByteArrayResource> viewResume(
            @PathVariable String userName,
            @PathVariable Long resumeId) {

        AdminResume adminResume =
                adminResumeService.getResumeFile(userName, resumeId);

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