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

import portfolio.dto.AdminRequestDTO;
import portfolio.dto.AdminResponseDTO;
import portfolio.utls.ApiResponse;
import portfolio.service.AdminService;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/admin")
    public ResponseEntity<ApiResponse> createAdmin(@RequestBody AdminRequestDTO adminDTO) {
        ApiResponse response = adminService.createAdmin(adminDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/admin/{userName}")
    public ResponseEntity<AdminResponseDTO> getAdmin(@PathVariable String userName) {
        AdminResponseDTO response = adminService.getAdmin(userName);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/admin/{userName}")
    public ResponseEntity<ApiResponse> updateAdmin(@PathVariable String userName, @RequestBody AdminRequestDTO adminDTO) {
        ApiResponse response = adminService.updateAdmin(adminDTO, userName);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/admin/{userName}")
    public ResponseEntity<ApiResponse> deleteAdmin(@PathVariable String userName) {
        ApiResponse response = adminService.deleteAdmin(userName);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}