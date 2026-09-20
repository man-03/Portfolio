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

import portfolio.dto.LicenseAndCertificationRequestDTO;
import portfolio.dto.LicenseAndCertificationResponseDTO;
import portfolio.service.LicenseAndCertificationService;
import portfolio.utls.ApiResponse;

@RestController
@RequestMapping("/api/admin")
public class LicenseAndCertificationController {

	private final LicenseAndCertificationService licenseAndCertificationService;
	
	public LicenseAndCertificationController(LicenseAndCertificationService licenseAndCertificationService) {
		this.licenseAndCertificationService = licenseAndCertificationService;
	}
	
	@PostMapping("{userName}/credential")
	public ResponseEntity<ApiResponse> createCredential(@PathVariable String userName, @RequestBody LicenseAndCertificationRequestDTO licenseAndCertificationRequestDTO) {
		ApiResponse response = licenseAndCertificationService.createCredential(userName, licenseAndCertificationRequestDTO);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@GetMapping("/{userName}/credential")
	public ResponseEntity<List<LicenseAndCertificationResponseDTO>> getCredential(@PathVariable String userName) {
		List<LicenseAndCertificationResponseDTO> response = licenseAndCertificationService.getCredential(userName);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PutMapping("/{userName}/credential/{credentialId}")
	public ResponseEntity<ApiResponse> updateCredentials(@PathVariable String userName, @PathVariable Long credentialId, @RequestBody LicenseAndCertificationRequestDTO licenseAndCertificationRequestDTO) {
		ApiResponse response = licenseAndCertificationService.updateCredential(userName, credentialId,  licenseAndCertificationRequestDTO);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@DeleteMapping("/credential/{credentialId}")
	public ResponseEntity<ApiResponse> deleteCredential(@PathVariable Long credentialId) {
		ApiResponse response = licenseAndCertificationService.deleteCredential(credentialId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
