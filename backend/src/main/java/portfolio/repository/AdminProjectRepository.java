package portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import portfolio.model.AdminProject;

@Repository
public interface AdminProjectRepository extends JpaRepository<AdminProject, Long>{
	
	List<AdminProject> findByAdmin_UserName(String userName);
	Optional<AdminProject> findByIdAndAdmin_UserName(Long projectId, String userName);
}
