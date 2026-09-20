package portfolio.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import portfolio.dto.AdminEducationRequestDTO;
import portfolio.dto.AdminEducationResponseDTO;
import portfolio.model.Admin;
import portfolio.model.AdminEducation;
import portfolio.repository.AdminEducationRepository;
import portfolio.repository.AdminRepository;
import portfolio.utls.AdminMapper;
import portfolio.utls.ApiResponse;
import portfolio.utls.EducationUpdateMapper;

@Service
public class AdminEducationService {
	
	private final AdminEducationRepository adminEducationRepository;
	private final AdminRepository adminRepository;
	private final AdminMapper adminMapper;
	private final EducationUpdateMapper educationUpdateMapper;
	
	public AdminEducationService(AdminEducationRepository adminEducationRepository, AdminRepository adminRepository, AdminMapper adminMapper, EducationUpdateMapper educationUpdateMapper) {
		this.adminEducationRepository = adminEducationRepository;
		this.adminRepository = adminRepository;
		this.adminMapper = adminMapper;
		this.educationUpdateMapper=  educationUpdateMapper;
	}
	
	public ApiResponse createEducation(String userName, AdminEducationRequestDTO adminEducationRequestDTO) {
		AdminEducation education = adminMapper.convertDTOToAdminEducation(adminEducationRequestDTO);
		Admin admin = adminRepository.findByUserName(userName)
				.orElseThrow(() -> new RuntimeException("Activity Not Found"));
		education.setAdmin(admin);
		adminEducationRepository.save(education);
		return new ApiResponse("True", "Education Saved Successfully");
	}
	
	public List<AdminEducationResponseDTO> getEducation(String userName) {
		List<AdminEducation> education = adminEducationRepository.findByAdmin_UserName(userName);
		return education.stream()
				.map(adminMapper::convertAdminEducationToDTO).toList();
	}
	
	// Existing entity is fetched as a managed entity.
	// @Transactional enables Hibernate Dirty Checking, so any modifications
	// made to the entity are automatically synchronized with the database
	// when the transaction commits. Explicit repository.save() is not required.
	@Transactional
	public ApiResponse updateEducation(String userName, Long educationId, AdminEducationRequestDTO adminEducationRequestDTO) {
		AdminEducation education = adminEducationRepository.findByIdAndAdmin_UserName(educationId, userName)
				.orElseThrow(() -> new RuntimeException("Education Not Found"));
		educationUpdateMapper.updateEducation(adminEducationRequestDTO, education);
		return new ApiResponse("True", "Education Updated Successfully");
	}
	
	@Transactional
	public ApiResponse deleteEducation(Long educationId) {
		AdminEducation education = adminEducationRepository.findById(educationId)
				.orElseThrow(() -> new RuntimeException("Eduction Not Found"));
		adminEducationRepository.delete(education);
		return new ApiResponse("True", "Education Updated Successfully");
	}
	
	
}
