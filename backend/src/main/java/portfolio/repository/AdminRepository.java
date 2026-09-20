package portfolio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import portfolio.model.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {

	Optional<Admin> findByUserName(String userName);
	void deleteByUserName(String userName);
}
