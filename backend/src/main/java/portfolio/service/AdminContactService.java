package portfolio.service;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import portfolio.dto.AdminContactRequestDTO;
import portfolio.dto.AdminContactResponseDTO;
import portfolio.model.Admin;
import portfolio.model.AdminContact;
import portfolio.repository.AdminContactRepository;
import portfolio.repository.AdminRepository;
import portfolio.utls.AdminMapper;
import portfolio.utls.ApiResponse;

@Service
public class AdminContactService {

	private final AdminContactRepository adminContactRepository;
	private final AdminRepository adminRepository;
	private final AdminMapper adminMapper;

	public AdminContactService(AdminContactRepository adminContactRepository, AdminRepository adminRepository, AdminMapper adminMapper) {
		this.adminContactRepository = adminContactRepository;
		this.adminRepository = adminRepository;
		this.adminMapper = adminMapper;
	}

	public ApiResponse createContact(String userName, AdminContactRequestDTO adminContactRequestDTO) {
		AdminContact contact = adminMapper.convertDTOToAdminContact(adminContactRequestDTO);
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		contact.setAdmin(admin);
		adminContactRepository.save(contact);
		return new ApiResponse("Success", "Contact Saved successfully");
	}

	public AdminContactResponseDTO getContact(String userName) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		AdminContact contact = adminContactRepository.findByAdmin_Id(admin.getId())
				.orElseThrow(() -> new RuntimeException("Contact Not Found"));
		return adminMapper.convertAdminContactToDTO(contact);
	}

	@Transactional
	public ApiResponse updateContact(String userName, Long contactId, AdminContactRequestDTO adminContactRequestDTO) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		AdminContact contact = adminContactRepository.findByIdAndAdmin_Id(contactId, admin.getId())
				.orElseThrow(() -> new RuntimeException("Contact Not Found"));
		adminMapper.updateAdminContact(adminContactRequestDTO, contact);
		return new ApiResponse("Success", "Contact Updated Successfully");
	}

	@Transactional
	public ApiResponse deleteContact(Long contactId, String userName) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		AdminContact contact = adminContactRepository.findByIdAndAdmin_Id(contactId, admin.getId())
				.orElseThrow(() -> new RuntimeException("Contact Not Found"));
		adminContactRepository.delete(contact);
		return new ApiResponse("Success", "Contact Deleted Successfully");
	}
}