package portfolio.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import portfolio.dto.AdminResumeResponseDTO;
import portfolio.model.Admin;
import portfolio.model.AdminResume;
import portfolio.repository.AdminRepository;
import portfolio.repository.AdminResumeRepository;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class AdminResumeService {

    private final AdminResumeRepository adminResumeRepository;
    private final AdminRepository adminRepository;

    public AdminResumeService(
            AdminResumeRepository adminResumeRepository,
            AdminRepository adminRepository) {

        this.adminResumeRepository = adminResumeRepository;
        this.adminRepository = adminRepository;
    }

    public AdminResumeResponseDTO uploadResume(
            String userName,
            MultipartFile file) throws IOException {

        Admin admin = adminRepository.findById(userName)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        validateFile(file);

        AdminResume adminResume = adminResumeRepository
                .findByAdminUserName(userName)
                .orElse(new AdminResume());

        adminResume.setAdmin(admin);
        adminResume.setFileName(file.getOriginalFilename());
        adminResume.setContentType(file.getContentType());
        adminResume.setFileSize(file.getSize());
        adminResume.setFileData(file.getBytes());
        adminResume.setUploadedAt(LocalDateTime.now());

        AdminResume savedResume =
                adminResumeRepository.save(adminResume);

        return mapToResponse(savedResume);
    }

    public AdminResumeResponseDTO getResume(String userName) {

        AdminResume adminResume = adminResumeRepository
                .findByAdminUserName(userName)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        return mapToResponse(adminResume);
    }

    public AdminResumeResponseDTO updateResume(
            String userName,
            MultipartFile file) throws IOException {

        AdminResume adminResume = adminResumeRepository
                .findByAdminUserName(userName)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        validateFile(file);

        adminResume.setFileName(file.getOriginalFilename());
        adminResume.setContentType(file.getContentType());
        adminResume.setFileSize(file.getSize());
        adminResume.setFileData(file.getBytes());
        adminResume.setUploadedAt(LocalDateTime.now());

        AdminResume updatedResume =
                adminResumeRepository.save(adminResume);

        return mapToResponse(updatedResume);
    }

    public void deleteResume(String userName) {

        AdminResume adminResume = adminResumeRepository
                .findByAdminUserName(userName)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        adminResumeRepository.delete(adminResume);
    }

    public AdminResume getResumeFile(String userName) {

        return adminResumeRepository
                .findByAdminUserName(userName)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));
    }

    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Resume file is required");
        }

        if (!"application/pdf".equalsIgnoreCase(
                file.getContentType())) {

            throw new RuntimeException("Only PDF files are allowed");
        }
    }

    private AdminResumeResponseDTO mapToResponse(
            AdminResume adminResume) {

        return new AdminResumeResponseDTO(
                adminResume.getId(),
                adminResume.getFileName(),
                adminResume.getContentType(),
                adminResume.getFileSize(),
                adminResume.getUploadedAt()
        );
    }
}