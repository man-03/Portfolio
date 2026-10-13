package portfolio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import portfolio.model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

	Optional<Admin> findByAdminAuth_AdminUser(String adminUser);
}