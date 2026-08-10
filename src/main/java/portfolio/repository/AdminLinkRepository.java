package portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import portfolio.model.AdminLink;

public interface AdminLinkRepository extends JpaRepository<AdminLink, Long> {

	List<AdminLink> findByAdmin_UserName(String userName);
	Optional<AdminLink> findByIdAndAdmin_UserName(Long linkId, String userName);
}
