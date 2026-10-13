package portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import portfolio.model.AdminLink;

public interface AdminLinkRepository extends JpaRepository<AdminLink, Long> {

	List<AdminLink> findByAdmin_Id(Long adminProfileId);
	Optional<AdminLink> findByIdAndAdmin_Id(Long linkId, Long adminProfileId);
}