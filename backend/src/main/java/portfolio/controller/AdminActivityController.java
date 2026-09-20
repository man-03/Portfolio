package portfolio.controller;

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

import portfolio.dto.AdminActivityRequestDTO;
import portfolio.dto.AdminActivityResponseDTO;
import portfolio.service.AdminActivityService;
import portfolio.utls.ApiResponse;

@RestController
@RequestMapping("/api/admin")
public class AdminActivityController {
	
	private final AdminActivityService adminActivityService;
	
	public AdminActivityController(AdminActivityService adminActivityService) {
		this.adminActivityService = adminActivityService;
	}
	
	@PostMapping("/{userName}/activity")
	public ResponseEntity<ApiResponse> createActivity(@PathVariable String userName, @RequestBody AdminActivityRequestDTO adminActivityRequestDTO) {
		ApiResponse response = adminActivityService.createActivity(userName, adminActivityRequestDTO);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@GetMapping("/{userName}/activity")
	public ResponseEntity<List<AdminActivityResponseDTO>> getActivity(@PathVariable String userName) {
		List<AdminActivityResponseDTO> response = adminActivityService.getActivity(userName);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PutMapping("/{userName}/activity/{activityId}")
	public ResponseEntity<ApiResponse> updateActivity(@PathVariable String userName, @PathVariable Long activityId, @RequestBody Map<String, Object> requestBody) {
		ApiResponse response = adminActivityService.updateActivity(userName, activityId, requestBody);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@DeleteMapping("/activity/{activityId}")
	public ResponseEntity<ApiResponse> deleteActivity(@PathVariable Long activityId) {
		ApiResponse response = adminActivityService.deleteActivity(activityId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
