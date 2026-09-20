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

import portfolio.dto.AdminEducationRequestDTO;
import portfolio.dto.AdminEducationResponseDTO;
import portfolio.service.AdminEducationService;
import portfolio.utls.ApiResponse;

@RestController
@RequestMapping("/api/admin")
public class AdminEducationController {
	
	private final AdminEducationService adminEducationService;
	
	public AdminEducationController(AdminEducationService adminEducationService) {
		this.adminEducationService = adminEducationService;
	}

	@PostMapping("/{userName}/education")
	public ResponseEntity<ApiResponse> createEducation(@PathVariable String userName, @RequestBody AdminEducationRequestDTO adminEducationRequestDTO) {
		ApiResponse response = adminEducationService.createEducation(userName, adminEducationRequestDTO);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@GetMapping("/{userName}/education")
	public ResponseEntity<List<AdminEducationResponseDTO>> getEducatoin(@PathVariable String userName) {
		List<AdminEducationResponseDTO> response = adminEducationService.getEducation(userName);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PutMapping("/{userName}/education/{educationId}")
	public ResponseEntity<ApiResponse> updateEducation(@PathVariable String userName, @PathVariable Long educationId, @RequestBody AdminEducationRequestDTO adminEducationRequestDTO) {
		ApiResponse response = adminEducationService.updateEducation(userName, educationId, adminEducationRequestDTO);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@DeleteMapping("/education/{educationId}")
	public ResponseEntity<ApiResponse> deleteEducation(@PathVariable Long educationId) {
		ApiResponse response = adminEducationService.deleteEducation(educationId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}