package portfolio.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import portfolio.dto.AdminActivityRequestDTO;
import portfolio.dto.AdminActivityResponseDTO;
import portfolio.model.Admin;
import portfolio.model.AdminActivity;
import portfolio.repository.AdminActivityRepository;
import portfolio.repository.AdminRepository;
import portfolio.utls.AdminMapper;
import portfolio.utls.ApiResponse;

@Service
public class AdminActivityService {

	private final AdminActivityRepository adminActivityRepository;
	private final AdminRepository adminRepository;
	private final AdminMapper adminMapper;

	public AdminActivityService(AdminActivityRepository adminActivityRepository, AdminRepository adminRepository, AdminMapper adminMapper) {
		this.adminActivityRepository = adminActivityRepository;
		this.adminMapper = adminMapper;
		this.adminRepository = adminRepository;
	}

	public ApiResponse createActivity(String userName, AdminActivityRequestDTO adminActivityRequestDTO) {
		AdminActivity activity = adminMapper.convertDTOToAdminActivity(adminActivityRequestDTO);
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		activity.setAdmin(admin);
		adminActivityRepository.save(activity);
		return new ApiResponse("Success", "Activity Saved Successfully");
	}

	public List<AdminActivityResponseDTO> getActivity(String userName) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		List<AdminActivity> activity = adminActivityRepository.findByAdmin_Id(admin.getId());
		return activity.stream()
				.map(adminMapper::convertAdminActivityToDTO)
				.toList();
	}

	public ApiResponse updateActivity(String userName, Long activityId, Map<String, Object> requestBody) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		AdminActivity activity = adminActivityRepository.findByIdAndAdmin_Id(activityId, admin.getId())
				.orElseThrow(() -> new RuntimeException("Activity Not Found"));
		adminMapper.updateAdminActivity(requestBody, activity);
		adminActivityRepository.save(activity);
		return new ApiResponse("Success", "Activity Updated Successfully");
	}

	public ApiResponse deleteActivity(String userName, Long activityId) {
		Admin admin = adminRepository.findByAdminAuth_AdminUser(userName)
				.orElseThrow(() -> new RuntimeException("Admin Not Found"));
		AdminActivity activity = adminActivityRepository.findByIdAndAdmin_Id(activityId, admin.getId())
				.orElseThrow(() -> new RuntimeException("Activity Not Found"));
		adminActivityRepository.delete(activity);
		return new ApiResponse("Success", "Activity Deleted Successfully");
	}
}