package portfolio.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;

import portfolio.dto.AdminSkillRequestDTO;
import portfolio.dto.AdminSkillResponseDTO;
import portfolio.dto.AdminSkillsAggregateRequestDTO;
import portfolio.dto.AdminSkillsAggregateResponseDTO;
import portfolio.dto.AdminSkillsCategoryRequestDTO;
import portfolio.dto.AdminSkillsCategoryResponseDTO;
import portfolio.model.Admin;
import portfolio.model.AdminSkill;
import portfolio.model.AdminSkillsCategory;
import portfolio.repository.AdminRepository;
import portfolio.repository.AdminSkillRepository;
import portfolio.repository.AdminSkillsCategoryRepository;
import portfolio.utls.AdminMapper;

@Service
public class AdminAggregateSkillsService {

    private final AdminRepository adminRepository;
    private final AdminSkillsCategoryRepository adminSkillsCategoryRepository;
    private final AdminSkillRepository adminSkillRepository;
    private final AdminMapper adminMapper;

    public AdminAggregateSkillsService(
            AdminRepository adminRepository,
            AdminSkillsCategoryRepository adminSkillsCategoryRepository,
            AdminSkillRepository adminSkillRepository,
            AdminMapper adminMapper) {

        this.adminRepository = adminRepository;
        this.adminSkillsCategoryRepository =
                adminSkillsCategoryRepository;
        this.adminSkillRepository = adminSkillRepository;
        this.adminMapper = adminMapper;
    }

    public AdminSkillsAggregateResponseDTO getSkills(
            String userName) {

        adminRepository.findByUserName(userName)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        List<AdminSkillsCategory> categories =
                adminSkillsCategoryRepository
                        .findByAdmin_UserName(userName);

        List<AdminSkillsCategoryResponseDTO> categoryDTOs =
                categories.stream()
                        .map(category -> {

                            AdminSkillsCategoryResponseDTO categoryDTO =
                                    adminMapper
                                            .convertAdminSkillsCategoryToDTO(
                                                    category);

                            List<AdminSkillResponseDTO> skillDTOs =
                                    adminSkillRepository
                                            .findByAdminSkillsCategory_Id(
                                                    category.getId())
                                            .stream()
                                            .map(adminMapper::convertAdminSkillToDTO)
                                            .toList();

                            categoryDTO.setSkills(skillDTOs);

                            return categoryDTO;
                        })
                        .toList();

        AdminSkillsAggregateResponseDTO response =
                new AdminSkillsAggregateResponseDTO();

        response.setCategories(categoryDTOs);

        return response;
    }

    @Transactional
    public AdminSkillsAggregateResponseDTO createSkills(
            String userName,
            AdminSkillsAggregateRequestDTO request) {

        Admin admin = adminRepository.findByUserName(userName)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        if (request.getCategories() == null) {
            throw new RuntimeException(
                    "Categories cannot be null");
        }

        for (AdminSkillsCategoryRequestDTO categoryDTO
                : request.getCategories()) {

            AdminSkillsCategory category =
                    adminMapper.convertDTOToAdminSkillsCategory(
                            categoryDTO);

            category.setAdmin(admin);

            category =
                    adminSkillsCategoryRepository.save(category);

            if (categoryDTO.getSkills() != null) {

                for (AdminSkillRequestDTO skillDTO
                        : categoryDTO.getSkills()) {

                    AdminSkill skill =
                            adminMapper.convertDTOToAdminSkill(
                                    skillDTO);

                    skill.setAdminSkillsCategory(category);

                    adminSkillRepository.save(skill);
                }
            }
        }

        return getSkills(userName);
    }

    @Transactional
    public AdminSkillsAggregateResponseDTO updateSkills(
            String userName,
            AdminSkillsAggregateRequestDTO request)
            throws JsonProcessingException {

        Admin admin = adminRepository.findByUserName(userName)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        List<AdminSkillsCategory> existingCategories =
                adminSkillsCategoryRepository
                        .findByAdmin_UserName(userName);

        Set<Long> receivedCategoryIds = new HashSet<>();

        if (request.getCategories() != null) {

            for (AdminSkillsCategoryRequestDTO categoryDTO
                    : request.getCategories()) {

                AdminSkillsCategory category;

                if (categoryDTO.getId() != null) {

                    // categoryId + userName
                    category =
                            adminSkillsCategoryRepository
                                    .findByIdAndAdmin_UserName(
                                            categoryDTO.getId(),
                                            userName)
                                    .orElseThrow(() ->
                                            new RuntimeException(
                                                    "Skills category not found"));

                    receivedCategoryIds.add(category.getId());

                    adminMapper.updateAdminSkillsCategory(
                            categoryDTO,
                            category);

                } else {

                    category =
                            adminMapper
                                    .convertDTOToAdminSkillsCategory(
                                            categoryDTO);

                    category.setAdmin(admin);

                    category =
                            adminSkillsCategoryRepository
                                    .save(category);

                    receivedCategoryIds.add(category.getId());
                }

                updateSkillsInsideCategory(
                        category,
                        categoryDTO);
            }
        }

        for (AdminSkillsCategory existingCategory
                : existingCategories) {

            if (!receivedCategoryIds.contains(
                    existingCategory.getId())) {

                List<AdminSkill> existingSkills =
                        adminSkillRepository
                                .findByAdminSkillsCategory_Id(
                                        existingCategory.getId());

                adminSkillRepository.deleteAll(existingSkills);

                adminSkillsCategoryRepository
                        .delete(existingCategory);
            }
        }

        return getSkills(userName);
    }

    private void updateSkillsInsideCategory(
            AdminSkillsCategory category,
            AdminSkillsCategoryRequestDTO categoryDTO)
            throws JsonProcessingException {

        List<AdminSkill> existingSkills =
                adminSkillRepository
                        .findByAdminSkillsCategory_Id(
                                category.getId());

        Set<Long> receivedSkillIds = new HashSet<>();

        if (categoryDTO.getSkills() != null) {

            for (AdminSkillRequestDTO skillDTO
                    : categoryDTO.getSkills()) {

                if (skillDTO.getId() != null) {

                    // skillId + categoryId
                    AdminSkill skill =
                            adminSkillRepository
                                    .findByIdAndAdminSkillsCategory_Id(
                                            skillDTO.getId(),
                                            category.getId())
                                    .orElseThrow(() ->
                                            new RuntimeException(
                                                    "Skill not found"));

                    receivedSkillIds.add(skill.getId());

                    skill.setSkill(skillDTO.getSkill());

                } else {

                    AdminSkill skill =
                            adminMapper.convertDTOToAdminSkill(
                                    skillDTO);

                    skill.setAdminSkillsCategory(category);

                    adminSkillRepository.save(skill);
                }
            }
        }

        for (AdminSkill existingSkill : existingSkills) {

            if (!receivedSkillIds.contains(
                    existingSkill.getId())) {

                adminSkillRepository.delete(existingSkill);
            }
        }
    }
}