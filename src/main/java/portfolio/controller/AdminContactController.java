package portfolio.controller;

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

import portfolio.dto.AdminContactRequestDTO;
import portfolio.dto.AdminContactResponseDTO;
import portfolio.service.AdminContactService;
import portfolio.utls.ApiResponse;

@RestController
@RequestMapping("/api/admin")
public class AdminContactController {

	private final AdminContactService adminContactService;
	
	public AdminContactController(AdminContactService adminContactservice) {
		this.adminContactService = adminContactservice;
	}
	
	@PostMapping("/{userName}/contact")
	public ResponseEntity<ApiResponse> createContact(@PathVariable String userName, @RequestBody AdminContactRequestDTO adminContactReqestDTO) {
		ApiResponse response = adminContactService.createContact(userName, adminContactReqestDTO);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@GetMapping("/{userName}/contact")
	public ResponseEntity<AdminContactResponseDTO> getContact(@PathVariable String userName, @RequestBody AdminContactRequestDTO adminContactReqestDTO) {
		AdminContactResponseDTO response = adminContactService.getContact(userName);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PutMapping("/{userName}/contact/{contactId}")
	public ResponseEntity<ApiResponse> updateContact(@PathVariable String userName, @PathVariable Long contactId, @RequestBody AdminContactRequestDTO adminContactReqestDTO) {
		ApiResponse response = adminContactService.updateContact(userName, contactId, adminContactReqestDTO);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@DeleteMapping("/contact/{contactId}")
	public ResponseEntity<ApiResponse> deleteContact(@PathVariable Long contactId) {
		ApiResponse response = adminContactService.deleteContact(contactId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
