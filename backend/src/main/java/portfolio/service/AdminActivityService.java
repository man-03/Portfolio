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
	
	public AdminActivityService(AdminActivityRepository adminActivityRepository, AdminRepository adminRepositor, AdminMapper adminMapper) {
		this.adminActivityRepository = adminActivityRepository;
		this.adminMapper = adminMapper;
		this.adminRepository = adminRepositor;
	}
	
	public ApiResponse createActivity(String userName, AdminActivityRequestDTO adminActivityRequestDTO) {
		AdminActivity activity = adminMapper.convetDTOToAdminActivity(adminActivityRequestDTO);
		Admin admin = adminRepository.findByUserName(userName)
				.orElseThrow(() -> new RuntimeException("Activity Not Found"));
		activity.setAmdin(admin);
		adminActivityRepository.save(activity);
		return new ApiResponse("True", "Activity Saved Successfully");
	}
	
	public List<AdminActivityResponseDTO> getActivity(String userName) {
		List<AdminActivity> activity = adminActivityRepository.findByAdmin_UserName(userName);
		return activity.stream()
				.map(adminMapper::convertAdminActivityToDTO)
				.toList();
	}
	
	public ApiResponse updateActivity(String userName, Long activityId, Map<String, Object> requestBody) {
		AdminActivity activity = adminActivityRepository.findByIdAndAdmin_UserName(activityId, userName)
				.orElseThrow(() -> new RuntimeException("Activity Not Found"));
		adminMapper.updateAdminActivity(requestBody, activity);
		adminActivityRepository.save(activity);
		return new ApiResponse("True", "Activity Updated Successfully");
	}
	
	public ApiResponse deleteActivity(Long activityId) {
		AdminActivity activity = adminActivityRepository.findById(activityId)
		.orElseThrow(() -> new RuntimeException("Activity Not Found"));;
		adminActivityRepository.delete(activity);
		return new ApiResponse("True", "Activity Deleted Successfully");
	}
}
