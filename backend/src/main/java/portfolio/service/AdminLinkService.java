package portfolio.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import portfolio.dto.AdminLinkRequestDTO;
import portfolio.dto.AdminLinkResponseDTO;
import portfolio.model.Admin;
import portfolio.model.AdminLink;
import portfolio.repository.AdminLinkRepository;
import portfolio.repository.AdminRepository;
import portfolio.utls.AdminMapper;
import portfolio.utls.ApiResponse;

@Service
public class AdminLinkService {

	private final AdminLinkRepository adminLinkRepository;
	private final AdminRepository adminRepository;
	private final AdminMapper adminMapper;


	public AdminLinkService(AdminLinkRepository adminLinkRepository, AdminRepository adminRepository, AdminMapper adminMapper) {
		this.adminLinkRepository = adminLinkRepository;
		this.adminRepository = adminRepository;
		this.adminMapper = adminMapper;
	}

	public ApiResponse createLink(String userName,  AdminLinkRequestDTO adminLinkRequestDTO) {
		AdminLink link = adminMapper.convertDTOToAdminLink(adminLinkRequestDTO);
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		link.setAdmin(admin);
		adminLinkRepository.save(link);
		return new ApiResponse("Success", "Link Saved Successfully");
	}

	public List<AdminLinkResponseDTO> getLink(String userName) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		List<AdminLink> link = adminLinkRepository.findByAdmin_Id(admin.getId());
		return link.stream()
				.map(adminMapper::convertAdminLinkToDTO)
				.toList();
	}

	@Transactional
	public ApiResponse updateLink(String userName, Long linkId, Map<String, Object> requestBody) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		AdminLink link = adminLinkRepository.findByIdAndAdmin_Id(linkId, admin.getId())
				.orElseThrow(() -> new RuntimeException("Link Not Found"));
		adminMapper.updateAdminLink(requestBody, link);
		return new ApiResponse("Success", "Link Updated Successfully");
	}

	@Transactional
	public ApiResponse deleteLink(String userName, Long linkId) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		AdminLink link = adminLinkRepository.findByIdAndAdmin_Id(linkId, admin.getId())
				.orElseThrow(() -> new RuntimeException("Link Not Found"));
		adminLinkRepository.delete(link);
		return new ApiResponse("Success", "Link Deleted Successfully");
	}
}