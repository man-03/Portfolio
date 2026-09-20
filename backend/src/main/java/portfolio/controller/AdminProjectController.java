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

import portfolio.dto.AdminProjectRequestDTO;
import portfolio.dto.AdminProjectResponseDTO;
import portfolio.service.AdminProjectService;
import portfolio.utls.ApiResponse;

@RestController
@RequestMapping("/api/admin")
public class AdminProjectController {
	
	private final AdminProjectService adminProjectService;
	
	public AdminProjectController(AdminProjectService adminProjectService) {
		this.adminProjectService = adminProjectService;
	}
	
	@PostMapping("/{userName}/project")
	public ResponseEntity<ApiResponse> createProject(@PathVariable String userName, @RequestBody AdminProjectRequestDTO adminProjectRequestDTO) {
		ApiResponse response = adminProjectService.createProject(adminProjectRequestDTO, userName);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@GetMapping("/{userName}/project")
	public ResponseEntity<List<AdminProjectResponseDTO>> getProject(@PathVariable String userName) {
		List<AdminProjectResponseDTO> response = adminProjectService.getProject(userName);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PutMapping("/{userName}/project/{projectId}")
	public ResponseEntity<ApiResponse> updateProject(@PathVariable String userName, @PathVariable Long projectId, @RequestBody AdminProjectRequestDTO adminProjectRequestDTO) {
		ApiResponse response = adminProjectService.updateProject(userName, projectId, adminProjectRequestDTO);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@DeleteMapping("/project/{projectId}")
	public ResponseEntity<ApiResponse> deleteProject(@PathVariable Long projectId) {
		ApiResponse response = adminProjectService.deleteProject(projectId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
