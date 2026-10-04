package portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import portfolio.model.AdminResume;

import java.util.Optional;

public interface AdminResumeRepository extends JpaRepository<AdminResume, Long> {

    Optional<AdminResume> findByAdminUserName(String userName);
}