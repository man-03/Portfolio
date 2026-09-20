package portfolio.service;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import portfolio.dto.AdminAddressResponseDTO;
import portfolio.dto.AdminRequestDTO;
import portfolio.dto.AdminResponseDTO;
import portfolio.model.Admin;
import portfolio.repository.AdminRepository;
import portfolio.utls.AdminMapper;
import portfolio.utls.ApiResponse;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final AdminAddressService adminAddressService;
    private final AdminMapper adminMapper;

    public AdminService(AdminRepository adminRepository, AdminAddressService adminAddressService, AdminMapper adminMapper) {
        this.adminRepository = adminRepository;
        this.adminAddressService = adminAddressService;
        this.adminMapper = adminMapper;
    }

    public ApiResponse createAdmin(AdminRequestDTO adminDTO) {
        Admin adminSave = adminMapper.convertDTOToAdmin(adminDTO);
        adminRepository.save(adminSave);
        adminAddressService.createAddress(adminDTO.getAdminAddressRequestDTO(), adminSave);	
        return new ApiResponse("True", "Admin Saved Successfully");
    }

    public AdminResponseDTO getAdmin(String userName) {
        Admin getAdmin = adminRepository.findByUserName(userName)
        		.orElseThrow(() -> new RuntimeException("Activity Not Found"));
        AdminAddressResponseDTO getAddress = adminAddressService.getAddress(userName);
        return adminMapper.convertAdminToDTO(getAdmin, getAddress);
    }

    @Transactional
    public ApiResponse updateAdmin(AdminRequestDTO adminDTO, String userName) {
        Admin adminUpdate = adminRepository.findByUserName(userName)
        		.orElseThrow(() -> new RuntimeException("Activity Not Found"));
        adminMapper.updateAdmin(adminDTO, adminUpdate);
        if (adminDTO.getAdminAddressRequestDTO() != null) {
            adminAddressService.updateAddress(adminDTO.getAdminAddressRequestDTO(),userName);
        }
        adminRepository.save(adminUpdate);
        return new ApiResponse("Success", "Admin Updated Successfully");
    }

    @Transactional
    public ApiResponse deleteAdmin(String userName) {
    	Admin admin= adminRepository.findByUserName(userName)
    			.orElseThrow(() -> new RuntimeException("Activity Not Found"));
        adminRepository.delete(admin);
        return new ApiResponse("Success", "Admin Deleted Successfully");
    }
}