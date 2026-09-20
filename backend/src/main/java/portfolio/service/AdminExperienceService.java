package portfolio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
	
	@Autowired
	private ExperienceUpdateMapper experienceUpdateMapper;
	
	public AdminExperienceService(AdminExperienceRepository adminExperienceRepository, AdminMapper adminMapper, AdminRepository adminRepository) {
		this.adminExperienceRepository = adminExperienceRepository;
		this.adminMapper = adminMapper;
		this.adminRepository = adminRepository;
	}
	
	public ApiResponse createExperience(AdminExperienceRequestDTO adminExperienceRequestDTO, String userName) {
		AdminExperience experience = adminMapper.convertDTOToAdminExperience(adminExperienceRequestDTO);
		Admin admin = adminRepository.findByUserName(userName)
				.orElseThrow(() -> new RuntimeException("Activity Not Found"));
		experience.setAdmin(admin);
		adminExperienceRepository.save(experience);
		return new ApiResponse("True", "Experience Saved Successfully");
	}
	
	public List<AdminExperienceResponseDTO> getExperience(String userName) {
		List<AdminExperience> experience = adminExperienceRepository.findByAdmin_UserName(userName);
		return experience.stream()
	        .map(adminMapper::convertAdminExperienceToDTO)
	        .toList();
	}
	
	public ApiResponse undateExperience(String userName, Long experienceId, AdminExperienceRequestDTO adminExperienceRequestDTO) {
		AdminExperience experience = adminExperienceRepository.findByIdAndAdmin_UserName(experienceId, userName)
				.orElseThrow(() -> new RuntimeException("Experience Not Found"));
		experienceUpdateMapper.updateExperience(adminExperienceRequestDTO, experience);
		
		// Existing entity is fetched from the database, updated using MapStruct,
		// and explicitly saved using repository.save().
		// This approach is clear and works with or without @Transactional.
		adminExperienceRepository.save(experience);
		return new ApiResponse("True", "Experience Updated Successfully");
	}
	
	@Transactional
	public ApiResponse deleteExperience(Long experienceId) {
		AdminExperience experience = adminExperienceRepository.findById(experienceId)
	            .orElseThrow(() -> new RuntimeException("Experience Not Found"));
	    adminExperienceRepository.delete(experience);
		return new ApiResponse("True", "Experience Deleted Successfully");
	}
}
