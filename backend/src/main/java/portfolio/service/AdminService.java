package portfolio.service;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import portfolio.dto.AdminAddressResponseDTO;
import portfolio.dto.AdminRequestDTO;
import portfolio.dto.AdminResponseDTO;
import portfolio.model.Admin;
import portfolio.model.AdminAuth;
import portfolio.repository.AdminAuthRepository;
import portfolio.repository.AdminRepository;
import portfolio.utls.AdminMapper;
import portfolio.utls.ApiResponse;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final AdminAuthRepository adminAuthRepository;
    private final AdminAddressService adminAddressService;
    private final AdminMapper adminMapper;

    public AdminService(
            AdminRepository adminRepository,
            AdminAuthRepository adminAuthRepository,
            AdminAddressService adminAddressService,
            AdminMapper adminMapper) {

        this.adminRepository = adminRepository;
        this.adminAuthRepository = adminAuthRepository;
        this.adminAddressService = adminAddressService;
        this.adminMapper = adminMapper;
    }

    public ApiResponse createAdmin(
            String userName,
            AdminRequestDTO adminDTO) {

        AdminAuth adminAuth = adminAuthRepository
                .findByAdminUser(userName)
                .orElseThrow(() ->
                        new RuntimeException("Admin Auth Not Found"));

        Admin admin = adminMapper.convertDTOToAdmin(adminDTO);
        admin.setAdminAuth(adminAuth);

        adminRepository.save(admin);

        if (adminDTO.getAdminAddressRequestDTO() != null) {
            adminAddressService.createAddress(
                    adminDTO.getAdminAddressRequestDTO(),
                    userName);
        }

        return new ApiResponse(
                "Success",
                "Admin Saved Successfully");
    }

    public AdminResponseDTO getAdmin(String userName) {

        Admin admin = adminRepository
                .findByAdminAuth_AdminUser(userName)
                .orElseThrow(() ->
                        new RuntimeException("Admin Not Found"));

        AdminAddressResponseDTO address =
                adminAddressService.getAddress(userName);

        return adminMapper.convertAdminToDTO(admin, address);
    }

    @Transactional
    public ApiResponse updateAdmin(
            AdminRequestDTO adminDTO,
            String userName) {

        Admin admin = adminRepository
                .findByAdminAuth_AdminUser(userName)
                .orElseThrow(() ->
                        new RuntimeException("Admin Not Found"));

        adminMapper.updateAdmin(adminDTO, admin);

        if (adminDTO.getAdminAddressRequestDTO() != null) {
            adminAddressService.updateAddress(
                    adminDTO.getAdminAddressRequestDTO(),
                    userName);
        }

        return new ApiResponse(
                "Success",
                "Admin Updated Successfully");
    }

    @Transactional
    public ApiResponse deleteAdmin(String userName) {

        Admin admin = adminRepository
                .findByAdminAuth_AdminUser(userName)
                .orElseThrow(() ->
                        new RuntimeException("Admin Not Found"));

        adminRepository.delete(admin);

        return new ApiResponse(
                "Success",
                "Admin Deleted Successfully");
    }
}