package portfolio.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import portfolio.dto.AdminExperienceRequestDTO;
import portfolio.dto.AdminExperienceResponseDTO;
import portfolio.model.Admin;
import portfolio.model.AdminExperience;
import portfolio.repository.AdminExperienceRepository;
import portfolio.repository.AdminRepository;
import portfolio.utls.AdminMapper;
import portfolio.utls.ApiResponse;
import portfolio.utls.ExperienceUpdateMapper;

@Service
public class AdminExperienceService {

	private final AdminMapper adminMapper;
	private final AdminExperienceRepository adminExperienceRepository;
	private final AdminRepository adminRepository;
	private final ExperienceUpdateMapper experienceUpdateMapper;

	public AdminExperienceService(AdminExperienceRepository adminExperienceRepository, AdminMapper adminMapper, AdminRepository adminRepository, ExperienceUpdateMapper experienceUpdateMapper) {
		this.adminExperienceRepository = adminExperienceRepository;
		this.adminMapper = adminMapper;
		this.adminRepository = adminRepository;
		this.experienceUpdateMapper = experienceUpdateMapper;
	}

	public ApiResponse createExperience(AdminExperienceRequestDTO adminExperienceRequestDTO, String userName) {
		AdminExperience experience = adminMapper.convertDTOToAdminExperience(adminExperienceRequestDTO);
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		experience.setAdmin(admin);
		adminExperienceRepository.save(experience);
		return new ApiResponse("Success", "Experience Saved Successfully");
	}

	public List<AdminExperienceResponseDTO> getExperience(String userName) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		List<AdminExperience> experience = adminExperienceRepository.findByAdmin_Id(admin.getId());
		return experience.stream()
				.map(adminMapper::convertAdminExperienceToDTO)
				.toList();
	}

	@Transactional
	public ApiResponse updateExperience(String userName, Long experienceId, AdminExperienceRequestDTO adminExperienceRequestDTO) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		AdminExperience experience = adminExperienceRepository.findByIdAndAdmin_Id(experienceId, admin.getId())
				.orElseThrow(() -> new RuntimeException("Experience Not Found"));
		experienceUpdateMapper.updateExperience(adminExperienceRequestDTO, experience);
		return new ApiResponse("Success", "Experience Updated Successfully");
	}

	@Transactional
	public ApiResponse deleteExperience(String userName, Long experienceId) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		AdminExperience experience = adminExperienceRepository.findByIdAndAdmin_Id(experienceId, admin.getId())
				.orElseThrow(() -> new RuntimeException("Experience Not Found"));
		adminExperienceRepository.delete(experience);
		return new ApiResponse("Success", "Experience Deleted Successfully");
	}
}