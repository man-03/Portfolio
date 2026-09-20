package portfolio.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonProcessingException;

import portfolio.dto.AdminSkillsAggregateRequestDTO;
import portfolio.dto.AdminSkillsAggregateResponseDTO;
import portfolio.service.AdminAggregateSkillsService;

@RestController
@RequestMapping("/api/admin")
public class AdminAggregateSkillsController {

	private final AdminAggregateSkillsService adminAggregateSkillsService;

	public AdminAggregateSkillsController(
			AdminAggregateSkillsService adminAggregateSkillsService) {

		this.adminAggregateSkillsService = adminAggregateSkillsService;
	}

	/*
	 * GET COMPLETE SKILLS
	 */
	@GetMapping("/{userName}/skills")
	public ResponseEntity<AdminSkillsAggregateResponseDTO> getSkills(
			@PathVariable String userName) {

		AdminSkillsAggregateResponseDTO response =
				adminAggregateSkillsService.getSkills(userName);

		return ResponseEntity.ok(response);
	}

	/*
	 * CREATE COMPLETE SKILLS
	 */
	@PostMapping("/{userName}/skills")
	public ResponseEntity<AdminSkillsAggregateResponseDTO> createSkills(
			@PathVariable String userName,
			@RequestBody AdminSkillsAggregateRequestDTO request) {

		AdminSkillsAggregateResponseDTO response =
				adminAggregateSkillsService.createSkills(
						userName,
						request);

		return ResponseEntity.ok(response);
	}

	/*
	 * UPDATE COMPLETE SKILLS
	 *
	 * Existing IDs -> Update
	 * Missing IDs  -> Create
	 * Removed IDs  -> Delete
	 */
	@PutMapping("/{userName}/skills")
	public ResponseEntity<AdminSkillsAggregateResponseDTO> updateSkills(
			@PathVariable String userName,
			@RequestBody AdminSkillsAggregateRequestDTO request)
			throws JsonProcessingException {

		AdminSkillsAggregateResponseDTO response =
				adminAggregateSkillsService.updateSkills(
						userName,
						request);

		return ResponseEntity.ok(response);
	}
}