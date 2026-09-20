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
		Admin admin = adminRepository.findByUserName(userName)
				.orElseThrow(() -> new RuntimeException());
		link.setAdmin(admin);
		adminLinkRepository.save(link);
		return new ApiResponse("True", "Link Saved Successfully");
	}
	
	public List<AdminLinkResponseDTO> getLink(String userName) {
		List<AdminLink> link = adminLinkRepository.findByAdmin_UserName(userName);
		return link.stream()
				.map(adminMapper::convertAdminLinkToDTO)
				.toList();
	}
	
	@Transactional
	public ApiResponse updateLink(String userName, Long linkId, Map<String, Object> requestBody) {
		AdminLink link = adminLinkRepository.findByIdAndAdmin_UserName(linkId, userName)
				.orElseThrow(() -> new RuntimeException());
		adminMapper.updateAdminLink(requestBody, link);
		return new ApiResponse("True", "Link Updated Successfully");
	}
	
	@Transactional
	public ApiResponse deleteLink(Long linkId) {
		AdminLink link = adminLinkRepository.findById(linkId)
				.orElseThrow(() -> new RuntimeException("Link Not Found"));
		adminLinkRepository.delete(link);
		return new ApiResponse("True", "Link Deleted Successfully");
	}
}
