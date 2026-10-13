package portfolio.service;

import org.springframework.stereotype.Service;


import jakarta.transaction.Transactional;
import portfolio.dto.AdminAddressRequestDTO;
import portfolio.dto.AdminAddressResponseDTO;
import portfolio.model.Admin;
import portfolio.model.AdminAddress;
import portfolio.repository.AdminAddressRepository;
import portfolio.repository.AdminRepository;
import portfolio.utls.AdminMapper;
import portfolio.utls.ApiResponse;

@Service
public class AdminAddressService {

	private final AdminAddressRepository adminAddressRepository;
	private final AdminRepository adminRepository;
	private final AdminMapper adminMapper;

	public AdminAddressService (AdminAddressRepository adminAddressRepository, AdminRepository adminRepository, AdminMapper adminMapper) {
		this.adminAddressRepository = adminAddressRepository;
		this.adminRepository = adminRepository;
		this.adminMapper = adminMapper;
	}

	public ApiResponse createAddress(AdminAddressRequestDTO adminAddressRequestDTO, String userName) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		AdminAddress address = adminMapper.convertDTOToAddress(adminAddressRequestDTO);
		address.setAdmin(admin);
		adminAddressRepository.save(address);
		return new ApiResponse("Success", "Address Saved Successfully");
	}

	public AdminAddressResponseDTO getAddress(String userName) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		AdminAddress address = adminAddressRepository.findByAdmin_Id(admin.getId())
				.orElseThrow(() -> new RuntimeException("Address Not Found"));
		return adminMapper.convertAddressToDTO(address);
	}

	public ApiResponse updateAddress(AdminAddressRequestDTO adminAddressRequestDTO, String userName) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		AdminAddress address = adminAddressRepository.findByAdmin_Id(admin.getId())
				.orElseThrow(() -> new RuntimeException("Address Not Found"));
		adminMapper.updateAddress(adminAddressRequestDTO, address);
		adminAddressRepository.save(address);
		return new ApiResponse("Success", "Address Updated Successfully");
	}

	@Transactional
	public ApiResponse deleteAddress(Long addressId) {
		AdminAddress address = adminAddressRepository.findById(addressId)
				.orElseThrow(() -> new RuntimeException("Address Not Found"));
		adminAddressRepository.delete(address);
		return new ApiResponse("Success", "Address Deleted Successfully");
	}
}