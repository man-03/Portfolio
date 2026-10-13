package portfolio.service;

import org.springframework.stereotype.Service;
import portfolio.dto.*;
import portfolio.model.*;
import portfolio.repository.*;
import portfolio.utls.AdminMapper;

import java.util.List;

@Service
public class GlobalService {

    final private AdminRepository adminRepository;
    final private AdminAddressRepository adminAddressRepository;
    final private AdminContactRepository adminContactRepository;
    final private AdminLinkRepository adminLinkRepository;
    final private AdminExperienceRepository adminExperienceRepository;
    final private AdminProjectRepository adminProjectRepository;
    final private AdminEducationRepository adminEducationRepository;
    final private LicenseAndCertificationRepository licenseAndCertificationRepository;
    final private AdminSkillsCategoryRepository adminSkillsCategoryRepository;
    final private AdminSkillRepository adminSkillRepository;
    final private AdminActivityRepository adminActivityRepository;
    final private AdminResumeRepository adminResumeRepository;
    final private AdminMapper adminMapper;

    public GlobalService(AdminRepository adminRepository, AdminAddressRepository adminAddressRepository, AdminContactRepository adminContactRepository,
                         AdminLinkRepository adminLinkRepository, AdminExperienceRepository adminExperienceRepository,
                         AdminProjectRepository adminProjectRepository, AdminEducationRepository adminEducationRepository,
                         LicenseAndCertificationRepository licenseAndCertificationRepository, AdminSkillsCategoryRepository adminSkillsCategoryRepository,
                         AdminSkillRepository adminSkillRepository, AdminActivityRepository adminActivityRepository,
                         AdminMapper adminMapper, AdminResumeRepository adminResumeRepository) {
        this.adminRepository = adminRepository;
        this.adminAddressRepository = adminAddressRepository;
        this.adminContactRepository = adminContactRepository;
        this.adminLinkRepository = adminLinkRepository;
        this.adminExperienceRepository = adminExperienceRepository;
        this.adminProjectRepository = adminProjectRepository;
        this.adminEducationRepository = adminEducationRepository;
        this.licenseAndCertificationRepository = licenseAndCertificationRepository;
        this.adminSkillsCategoryRepository = adminSkillsCategoryRepository;
        this.adminSkillRepository = adminSkillRepository;
        this.adminActivityRepository = adminActivityRepository;
        this.adminMapper = adminMapper;
        this.adminResumeRepository = adminResumeRepository;
    }

    public GlobalResponseDTO userOnLoad(String userName) {
        GlobalResponseDTO globalResponseDTO = new GlobalResponseDTO();
        Admin admin = adminRepository.findByAdminAuth_AdminUser(userName).orElseThrow(() -> new RuntimeException("User Not Found"));
        Long adminId = admin.getId();

        AdminAddress address = adminAddressRepository.findByAdmin_Id(adminId).orElseThrow(() -> new RuntimeException("Address Not Found"));
        AdminAddressResponseDTO adminAddressResponseDTO = adminMapper.convertAddressToDTO(address);
        AdminResponseDTO adminResponseDTO = adminMapper.convertAdminToDTO(admin, adminAddressResponseDTO);

        AdminContact contact = adminContactRepository.findByAdmin_Id(adminId).orElseThrow(() -> new RuntimeException("User Not Found"));
        AdminContactResponseDTO adminContactResponseDTO = adminMapper.convertAdminContactToDTO(contact);

        List<AdminLink> link = adminLinkRepository.findByAdmin_Id(adminId);
        List<AdminLinkResponseDTO> adminLinkResponseDTO = link.stream().map(adminMapper::convertAdminLinkToDTO).toList();

        List<AdminExperience> experience = adminExperienceRepository.findByAdmin_Id(adminId);
        List<AdminExperienceResponseDTO> adminExperienceResponseDTO = experience.stream().map(adminMapper::convertAdminExperienceToDTO).toList();

        List<AdminProject> project = adminProjectRepository.findByAdmin_Id(adminId);
        List<AdminProjectResponseDTO> adminProjectRequestDTOS = project.stream().map(adminMapper::convertAdminProjectToDTO).toList();

        List<AdminEducation> education = adminEducationRepository.findByAdmin_Id(adminId);
        List<AdminEducationResponseDTO> adminEducationResponseDTOS = education.stream().map(adminMapper::convertAdminEducationToDTO).toList();

        List<LicenseAndCertification> licenseAndCertification = licenseAndCertificationRepository.findByAdmin_Id(adminId);
        List<LicenseAndCertificationResponseDTO> licenseAndCertificationResponseDTOS = licenseAndCertification.stream().map(adminMapper::convertLicenseAndCertificationToDTO).toList();

        List<AdminActivity> activity = adminActivityRepository.findByAdmin_Id(adminId);
        List<AdminActivityResponseDTO> adminActivityResponseDTOS = activity.stream().map(adminMapper::convertAdminActivityToDTO).toList();

        List<AdminSkillsCategory> categories = adminSkillsCategoryRepository.findByAdmin_Id(adminId);
        List<AdminSkillsCategoryResponseDTO> categoryDTOs =
                categories.stream()
                        .map(category -> {

                            AdminSkillsCategoryResponseDTO categoryDTO =
                                    adminMapper.convertAdminSkillsCategoryToDTO(category);

                            List<AdminSkillResponseDTO> skillDTOs =
                                    adminSkillRepository
                                            .findByAdminSkillsCategory_Id(category.getId())
                                            .stream()
                                            .map(adminMapper::convertAdminSkillToDTO)
                                            .toList();

                            categoryDTO.setSkills(skillDTOs);

                            return categoryDTO;
                        })
                        .toList();

        AdminSkillsAggregateResponseDTO adminSkillsAggregateResponseDTO = new AdminSkillsAggregateResponseDTO();
        adminSkillsAggregateResponseDTO.setCategories(categoryDTOs);

        AdminResumeResponseDTO resumeResponse = adminResumeRepository
                .findByAdmin_Id(adminId)
                .map(adminResume -> new AdminResumeResponseDTO(
                        adminResume.getId(),
                        adminResume.getFileName(),
                        adminResume.getContentType(),
                        adminResume.getFileSize(),
                        adminResume.getUploadedAt()
                ))
                .orElse(null);

        globalResponseDTO.setAdmin(adminResponseDTO);
        globalResponseDTO.setContact(adminContactResponseDTO);
        globalResponseDTO.setLink(adminLinkResponseDTO);
        globalResponseDTO.setExperience(adminExperienceResponseDTO);
        globalResponseDTO.setProject(adminProjectRequestDTOS);
        globalResponseDTO.setEducation(adminEducationResponseDTOS);
        globalResponseDTO.setLicenseAndCertification(licenseAndCertificationResponseDTOS);
        globalResponseDTO.setSkills(adminSkillsAggregateResponseDTO);
        globalResponseDTO.setActivity(adminActivityResponseDTOS);
        globalResponseDTO.setResume(resumeResponse);

        return globalResponseDTO;
    }

    public AdminResume getResumeFile(String userName) {
        Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        return adminResumeRepository
                .findByAdmin_Id(admin.getId())
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));
    }
}