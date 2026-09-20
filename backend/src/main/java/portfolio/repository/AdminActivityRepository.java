package portfolio.repository;

import java.util.List;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import portfolio.model.AdminActivity;

public interface AdminActivityRepository extends JpaRepository<AdminActivity, Long>{

	List<AdminActivity> findByAdmin_UserName(String userName);
	Optional<AdminActivity> findByIdAndAdmin_UserName(Long activityId, String userName);
}
