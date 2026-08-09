package portfolio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import portfolio.model.AdminContact;

@Repository
public interface AdminContactRepository extends JpaRepository<AdminContact, Long> {
	
	Optional<AdminContact> findByAdmin_UserName(String userName);
	Optional<AdminContact> findByIdAndAdmin_UserName(Long contactId, String userName);
}
