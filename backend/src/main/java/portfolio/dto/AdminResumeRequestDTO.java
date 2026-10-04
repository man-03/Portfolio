package portfolio.dto;

import org.springframework.web.multipart.MultipartFile;

public class AdminResumeRequestDTO {

    private MultipartFile file;

    public AdminResumeRequestDTO() {
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
