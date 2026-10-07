package portfolio.controller;

import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import portfolio.dto.AdminLinkRequestDTO;
import portfolio.dto.AdminLinkResponseDTO;
import portfolio.service.AdminLinkService;
import portfolio.utls.ApiResponse;

@RestController
@RequestMapping("/api/admin")
public class AdminLinkController {

	private final AdminLinkService adminLinkService;
	
	public AdminLinkController(AdminLinkService adminLinkService) {
		this.adminLinkService = adminLinkService;
	}
	
	@PostMapping("{userName}/link")
	@PreAuthorize("@adminAuthorizationService.isCurrentAdmin(authentication, #userName)")
	public ResponseEntity<ApiResponse> createLink(@PathVariable String userName, @RequestBody AdminLinkRequestDTO adminLinkRequestDTO) {
		ApiResponse response = adminLinkService.createLink(userName, adminLinkRequestDTO);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@GetMapping("{userName}/link")
	@PreAuthorize("@adminAuthorizationService.isCurrentAdmin(authentication, #userName)")
	public ResponseEntity<List<AdminLinkResponseDTO>> getLink(@PathVariable String userName) {
		List<AdminLinkResponseDTO> response = adminLinkService.getLink(userName);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PutMapping("{userName}/link/{linkId}")
	@PreAuthorize("@adminAuthorizationService.isCurrentAdmin(authentication, #userName)")
	public ResponseEntity<ApiResponse> updateLink(@PathVariable String userName, @PathVariable Long linkId, @RequestBody Map<String, Object> requestBody) {
		ApiResponse response = adminLinkService.updateLink(userName, linkId, requestBody);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@DeleteMapping("{userName}/link/{linkId}")
	@PreAuthorize("@adminAuthorizationService.isCurrentAdmin(authentication, #userName)")
	public ResponseEntity<ApiResponse> deleteLink(@PathVariable String userName, @PathVariable Long linkId) {
		ApiResponse response = adminLinkService.deleteLink(userName, linkId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
		
}
