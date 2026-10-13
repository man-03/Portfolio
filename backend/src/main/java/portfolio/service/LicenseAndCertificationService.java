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
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		credential.setAdmin(admin);
		licenseAndCertificationRepository.save(credential);
		return new ApiResponse("Success", "Credential Saved Successfully");
	}

	public List<LicenseAndCertificationResponseDTO> getCredential(String userName) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		List<LicenseAndCertification> credential = licenseAndCertificationRepository.findByAdmin_Id(admin.getId());
		return credential.stream()
				.map(adminMapper::convertLicenseAndCertificationToDTO)
				.toList();
	}

	@Transactional
	public ApiResponse updateCredential(String userName, Long credentialId, LicenseAndCertificationRequestDTO licenseAndCertificationRequestDTO) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		LicenseAndCertification credential = licenseAndCertificationRepository.findByIdAndAdmin_Id(credentialId, admin.getId())
				.orElseThrow(() -> new RuntimeException("Credential Not Found"));
		licenseAndCertificationUpdateMapper.updateLicenseAndCertification(licenseAndCertificationRequestDTO, credential);
		return new ApiResponse("Success", "Credential Updated Successfully");
	}

	@Transactional
	public ApiResponse deleteCredential(String userName, Long credentialId) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		LicenseAndCertification credential = licenseAndCertificationRepository.findByIdAndAdmin_Id(credentialId, admin.getId())
				.orElseThrow(() -> new RuntimeException("Credential Not Found"));
		licenseAndCertificationRepository.delete(credential);
		return new ApiResponse("Success", "Credential Deleted Successfully");
	}
}