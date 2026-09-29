package portfolio.repository;

import portfolio.model.AdminAuth;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminAuthRepository extends JpaRepository<AdminAuth, Long> {

    Optional<AdminAuth> findByEmail(String email);

    boolean existsByEmail(String email);
}