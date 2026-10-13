package portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import portfolio.model.AdminExperience;

@Repository
public interface AdminExperienceRepository extends JpaRepository<AdminExperience, Long> {

	List<AdminExperience> findByAdmin_Id(Long adminProfileId);
	Optional<AdminExperience> findByIdAndAdmin_Id(Long experienceId, Long adminProfileId);
}