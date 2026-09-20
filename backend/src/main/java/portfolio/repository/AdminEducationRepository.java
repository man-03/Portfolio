package portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import portfolio.model.AdminEducation;

@Repository
public interface AdminEducationRepository extends JpaRepository<AdminEducation, Long> {

	List<AdminEducation> findByAdmin_UserName(String userName);
	Optional<AdminEducation> findByIdAndAdmin_UserName(Long educationId, String userName);
}
