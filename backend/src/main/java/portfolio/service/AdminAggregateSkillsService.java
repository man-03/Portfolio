package portfolio.service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;

import portfolio.dto.AdminSkillResponseDTO;
import portfolio.dto.AdminSkillsAggregateRequestDTO;
import portfolio.dto.AdminSkillsAggregateResponseDTO;
import portfolio.dto.AdminSkillsCategoryRequestDTO;
import portfolio.dto.AdminSkillsCategoryResponseDTO;
import portfolio.dto.AdminSkillRequestDTO;
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
        this.adminSkillsCategoryRepository = adminSkillsCategoryRepository;
        this.adminSkillRepository = adminSkillRepository;
        this.adminMapper = adminMapper;
    }

    /*
     * GET COMPLETE SKILLS STRUCTURE
     */
    public AdminSkillsAggregateResponseDTO getSkills(String userName) {

        Admin admin = adminRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        List<AdminSkillsCategory> categories =
                adminSkillsCategoryRepository.findByAdmin_UserName(userName);

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

        AdminSkillsAggregateResponseDTO response =
                new AdminSkillsAggregateResponseDTO();

        response.setCategories(categoryDTOs);

        return response;
    }

    /*
     * CREATE COMPLETE SKILLS STRUCTURE
     */
    @Transactional
    public AdminSkillsAggregateResponseDTO createSkills(
            String userName,
            AdminSkillsAggregateRequestDTO request) {

        Admin admin = adminRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (request.getCategories() == null) {
            throw new RuntimeException("Categories cannot be null");
        }

        for (AdminSkillsCategoryRequestDTO categoryDTO
                : request.getCategories()) {

            AdminSkillsCategory category =
                    adminMapper.convertDTOToAdminSkillsCategory(categoryDTO);

            category.setAdmin(admin);

            category =
                    adminSkillsCategoryRepository.save(category);

            if (categoryDTO.getSkills() != null) {

                for (AdminSkillRequestDTO skillDTO
                        : categoryDTO.getSkills()) {

                    AdminSkill skill =
                            adminMapper.convertDTOToAdminSkill(skillDTO);

                    /*
                     * AdminSkill belongs to AdminSkillsCategory.
                     */
                    skill.setAdminSkillsCategory(category);

                    adminSkillRepository.save(skill);
                }
            }
        }

        return getSkills(userName);
    }

    /*
     * UPDATE COMPLETE SKILLS STRUCTURE
     *
     * Existing ID  -> UPDATE
     * No ID         -> CREATE
     * Missing DB ID -> DELETE
     */
    @Transactional
    public AdminSkillsAggregateResponseDTO updateSkills(
            String userName,
            AdminSkillsAggregateRequestDTO request)
            throws JsonProcessingException {

        Admin admin = adminRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        List<AdminSkillsCategory> existingCategories =
                adminSkillsCategoryRepository.findByAdmin_UserName(userName);

        /*
         * Keep track of category IDs received from UI.
         *
         * Any existing category ID that is NOT present here
         * must be deleted.
         */
        Set<Long> receivedCategoryIds = new HashSet<>();

        if (request.getCategories() != null) {

            for (AdminSkillsCategoryRequestDTO categoryDTO
                    : request.getCategories()) {

                AdminSkillsCategory category;

                /*
                 * EXISTING CATEGORY
                 */
                if (categoryDTO.getId() != null) {

                    category =
                            adminSkillsCategoryRepository
                                    .findByIdAndAdmin_UserName(
                                            categoryDTO.getId(),
                                            userName)
                                    .orElseThrow(() ->
                                            new RuntimeException(
                                                    "Skills category not found"));

                    receivedCategoryIds.add(category.getId());

                    /*
                     * Update category using ObjectMapper
                     */
                    adminMapper.updateAdminSkillsCategory(
                            categoryDTO,
                            category);
                }

                /*
                 * NEW CATEGORY
                 */
                else {

                    category =
                            adminMapper.convertDTOToAdminSkillsCategory(
                                    categoryDTO);

                    category.setAdmin(admin);

                    category =
                            adminSkillsCategoryRepository.save(category);

                    receivedCategoryIds.add(category.getId());
                }

                /*
                 * Reconcile skills inside this category.
                 */
                updateSkillsInsideCategory(
                        category,
                        categoryDTO);
            }
        }

        /*
         * DELETE CATEGORIES REMOVED FROM UI
         */
        for (AdminSkillsCategory existingCategory : existingCategories) {

            if (!receivedCategoryIds.contains(existingCategory.getId())) {

                /*
                 * Delete skills first because AdminSkill has
                 * foreign key -> AdminSkillsCategory.
                 */
                List<AdminSkill> existingSkills =
                        adminSkillRepository
                                .findByAdminSkillsCategory_Id(
                                        existingCategory.getId());

                adminSkillRepository.deleteAll(existingSkills);

                adminSkillsCategoryRepository.delete(existingCategory);
            }
        }

        return getSkills(userName);
    }

    /*
     * RECONCILE SKILLS INSIDE ONE CATEGORY
     */
    private void updateSkillsInsideCategory(
            AdminSkillsCategory category,
            AdminSkillsCategoryRequestDTO categoryDTO)
            throws JsonProcessingException {

        List<AdminSkill> existingSkills =
                adminSkillRepository
                        .findByAdminSkillsCategory_Id(
                                category.getId());

        /*
         * IDs of skills received from UI.
         *
         * Existing DB skill IDs not present here
         * will be deleted.
         */
        Set<Long> receivedSkillIds = new HashSet<>();

        if (categoryDTO.getSkills() != null) {

            for (AdminSkillRequestDTO skillDTO
                    : categoryDTO.getSkills()) {

                /*
                 * EXISTING SKILL
                 */
                if (skillDTO.getId() != null) {

                    AdminSkill skill =
                            adminSkillRepository
                                    .findByIdAndAdminSkillsCategory_Id(
                                            skillDTO.getId(),
                                            category.getId())
                                    .orElseThrow(() ->
                                            new RuntimeException(
                                                    "Skill not found"));

                    receivedSkillIds.add(skill.getId());

                    /*
                     * Update using your existing
                     * Map<String,Object> + ObjectMapper
                     * approach is separate from this aggregate DTO.
                     *
                     * Here we directly update the DTO-backed entity.
                     */
                    skill.setSkill(skillDTO.getSkill());
                }

                /*
                 * NEW SKILL
                 */
                else {

                    AdminSkill skill =
                            adminMapper.convertDTOToAdminSkill(
                                    skillDTO);

                    /*
                     * IMPORTANT:
                     * AdminSkill has NO Admin field.
                     */
                    skill.setAdminSkillsCategory(category);

                    adminSkillRepository.save(skill);
                }
            }
        }

        /*
         * DELETE SKILLS REMOVED FROM UI
         */
        for (AdminSkill existingSkill : existingSkills) {

            if (!receivedSkillIds.contains(existingSkill.getId())) {

                adminSkillRepository.delete(existingSkill);
            }
        }
    }
}