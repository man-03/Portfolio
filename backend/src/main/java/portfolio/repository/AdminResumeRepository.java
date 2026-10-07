package portfolio.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import portfolio.model.AdminResume;

public interface AdminResumeRepository extends JpaRepository<AdminResume, Long> {

    Optional<AdminResume> findByAdminUserName(String userName);

    Optional<AdminResume> findByIdAndAdmin_UserName(Long resumeId, String userName);
}