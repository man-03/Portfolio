package portfolio.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import portfolio.model.AdminResume;

public interface AdminResumeRepository extends JpaRepository<AdminResume, Long> {

    Optional<AdminResume> findByAdmin_Id(Long adminProfileId);
    Optional<AdminResume> findByIdAndAdmin_Id(Long resumeId, Long adminProfileId);
}