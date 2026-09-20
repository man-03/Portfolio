package portfolio.controller;

import java.util.List;

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

import portfolio.dto.AdminExperienceRequestDTO;
import portfolio.dto.AdminExperienceResponseDTO;
import portfolio.service.AdminExperienceService;
import portfolio.utls.ApiResponse;

@RestController
@RequestMapping("/api/admin")
public class AdminExperienceController {

	private final AdminExperienceService adminExperienceService;
	
	public AdminExperienceController(AdminExperienceService adminExperienceService) {
		this.adminExperienceService = adminExperienceService;
	}
	
	@PostMapping("/{userName}/experience")
	public ResponseEntity<ApiResponse> createExperience(@PathVariable String userName, @RequestBody AdminExperienceRequestDTO adminExperienceRequestDTO) {
		ApiResponse response = adminExperienceService.createExperience(adminExperienceRequestDTO, userName);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@GetMapping("/{userName}/experience")
	public ResponseEntity<List<AdminExperienceResponseDTO>> getAdmin(@PathVariable String userName) {
		List<AdminExperienceResponseDTO> response = adminExperienceService.getExperience(userName);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PutMapping("/{userName}/experience/{experienceId}")
	public ResponseEntity<ApiResponse> updateExperience(@PathVariable String userName, @PathVariable Long experienceId,  @RequestBody AdminExperienceRequestDTO adminExperienceRequestDTO) {
		ApiResponse response = adminExperienceService.undateExperience(userName, experienceId, adminExperienceRequestDTO);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@DeleteMapping("/experience/{experienceId}")
	public ResponseEntity<ApiResponse> deleteExperience(@PathVariable Long experienceId) {
		ApiResponse response = adminExperienceService.deleteExperience(experienceId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
