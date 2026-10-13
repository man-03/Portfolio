package portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import portfolio.model.AdminEducation;

@Repository
public interface AdminEducationRepository extends JpaRepository<AdminEducation, Long> {

	List<AdminEducation> findByAdmin_Id(Long adminProfileId);
	Optional<AdminEducation> findByIdAndAdmin_Id(Long educationId, Long adminProfileId);
}