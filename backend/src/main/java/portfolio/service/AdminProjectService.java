package portfolio.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import portfolio.dto.AdminProjectRequestDTO;
import portfolio.dto.AdminProjectResponseDTO;
import portfolio.model.Admin;
import portfolio.model.AdminProject;
import portfolio.repository.AdminProjectRepository;
import portfolio.repository.AdminRepository;
import portfolio.utls.AdminMapper;
import portfolio.utls.ApiResponse;
import portfolio.utls.ProjectUpdateMapper;

@Service
public class AdminProjectService {

	private final AdminProjectRepository adminProjectRepository;
	private final AdminRepository adminRepository;
	private final AdminMapper adminMapper;
	private final ProjectUpdateMapper projectUpdateMapper;
	
	public AdminProjectService(AdminProjectRepository adminProjectRepository, AdminRepository adminRepository, AdminMapper adminMapper, ProjectUpdateMapper projectUpdateMapper) {
		this.adminProjectRepository = adminProjectRepository;
		this.adminRepository = adminRepository;
		this.adminMapper = adminMapper;
		this.projectUpdateMapper = projectUpdateMapper;
	}
	
	public ApiResponse createProject(AdminProjectRequestDTO adminProjectRequestDTO, String userName) {
		AdminProject project = adminMapper.convertDTOToAdminProject(adminProjectRequestDTO);
		Admin admin = adminRepository.findByUserName(userName)
				.orElseThrow(() -> new RuntimeException("Activity Not Found"));
		project.setAdmin(admin);
		adminProjectRepository.save(project);
		return new ApiResponse("True", "Project Saved Successfully");	
	}
	
	public List<AdminProjectResponseDTO> getProject(String userName) {
		List<AdminProject> project = adminProjectRepository.findByAdmin_UserName(userName);
		return project.stream()
				.map(adminMapper::convertAdminProjectToDTO)
				.toList();
	}
	
	@Transactional
	public ApiResponse updateProject(String userName, Long projectId, AdminProjectRequestDTO adminProjectRequestDTO) {
		AdminProject project = adminProjectRepository.findByIdAndAdmin_UserName(projectId, userName)
				.orElseThrow(() -> new RuntimeException("Project Not Found"));
		projectUpdateMapper.updateProject(adminProjectRequestDTO, project);
		return new ApiResponse("True", "Project Updates Successfully");
	}
	
	@Transactional
	public ApiResponse deleteProject(Long projectId) {
		AdminProject project = adminProjectRepository.findById(projectId)
				.orElseThrow(() -> new RuntimeException("Project Not Found"));
		adminProjectRepository.delete(project);
		return new ApiResponse("True", "Project Deleted Successfully");
	}
}
