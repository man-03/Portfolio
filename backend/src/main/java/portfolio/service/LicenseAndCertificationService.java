package portfolio.service;

import java.util.List;


import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import portfolio.dto.LicenseAndCertificationRequestDTO;
import portfolio.dto.LicenseAndCertificationResponseDTO;
import portfolio.model.Admin;
import portfolio.model.LicenseAndCertification;
import portfolio.repository.AdminRepository;
import portfolio.repository.LicenseAndCertificationRepository;
import portfolio.utls.AdminMapper;
import portfolio.utls.ApiResponse;
import portfolio.utls.LicenseAndCertificationUpdateMapper;

@Service
public class LicenseAndCertificationService {
	
	private final LicenseAndCertificationRepository licenseAndCertificationRepository;
	private final AdminRepository adminRepository;
	private final LicenseAndCertificationUpdateMapper licenseAndCertificationUpdateMapper;
	private final AdminMapper adminMapper;
	
	public LicenseAndCertificationService(LicenseAndCertificationRepository licenseAndCertificationRepository, AdminRepository adminRepository, LicenseAndCertificationUpdateMapper licenseAndCertificationUpdateMapper, AdminMapper adminMapper) {
		this.licenseAndCertificationRepository = licenseAndCertificationRepository;
		this.adminMapper = adminMapper;
		this.adminRepository = adminRepository;
		this.licenseAndCertificationUpdateMapper = licenseAndCertificationUpdateMapper;
	}
	
	public ApiResponse createCredential(String userName, LicenseAndCertificationRequestDTO licenseAndCertificationRequestDTO) {
		LicenseAndCertification credential = adminMapper.convertDTOToLicenseAndCertification(licenseAndCertificationRequestDTO);
		Admin admin = adminRepository.findByUserName(userName)
				.orElseThrow(() -> new RuntimeException("Activity Not Found"));
		credential.setAdmin(admin);
		licenseAndCertificationRepository.save(credential);
		return new ApiResponse("True", "Credential Saved Successfully");
	}
	
	public List<LicenseAndCertificationResponseDTO> getCredential(String userName) {
		List<LicenseAndCertification> credential = licenseAndCertificationRepository.findByAdmin_UserName(userName);
		return credential.stream()
				.map(adminMapper::convertLicenseAndCertificationToDTO)
				.toList();
	}
	
	@Transactional
	public ApiResponse updateCredential(String userName, Long credentialId, LicenseAndCertificationRequestDTO licenseAndCertificationRequestDTO) {
		LicenseAndCertification credentail = licenseAndCertificationRepository.findByIdAndAdmin_UserName(credentialId, userName)
				.orElseThrow(() -> new RuntimeException("Crednetial Not Found"));
		licenseAndCertificationUpdateMapper.updateLicenseAndCertification(licenseAndCertificationRequestDTO, credentail);
		return new ApiResponse("True", "Credential Updated Successfully");
	}
	
	@Transactional
	public ApiResponse deleteCredential(Long credentialId) {
		LicenseAndCertification credential = licenseAndCertificationRepository.findById(credentialId)
				.orElseThrow(() -> new RuntimeException("Crednetial Not Found"));
		licenseAndCertificationRepository.delete(credential);
		return new ApiResponse("True", "Credential Deleted Successfully");
	}
}
