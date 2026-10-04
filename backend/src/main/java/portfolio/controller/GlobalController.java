package portfolio.controller;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import portfolio.dto.GlobalResponseDTO;
import portfolio.model.AdminResume;
import portfolio.service.GlobalService;

@RestController
@RequestMapping("/api/public")
public class GlobalController {

    final private GlobalService globalService;

    public GlobalController(GlobalService globalService) {
        this.globalService = globalService;
    }

    @PostMapping("/{userName}")
    public ResponseEntity<GlobalResponseDTO> userOnLoad(@PathVariable String userName) {
        GlobalResponseDTO response = globalService.userOnLoad(userName);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * @param userName
     * @return
     */
    @GetMapping("{userName}/resume")
    public ResponseEntity<ByteArrayResource> getResume(
            @PathVariable String userName) {

        AdminResume adminResume =
                globalService.getResumeFile(userName);

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
