package portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import portfolio.model.AdminSkillsCategory;

@Repository
public interface AdminSkillsCategoryRepository extends JpaRepository<AdminSkillsCategory, Long> {

    List<AdminSkillsCategory> findByAdmin_Id(Long adminProfileId);
    Optional<AdminSkillsCategory> findByIdAndAdmin_Id(Long categoryId, Long adminProfileId);
}