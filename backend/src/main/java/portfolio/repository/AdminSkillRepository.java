package portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import portfolio.model.AdminSkill;

public interface AdminSkillRepository
        extends JpaRepository<AdminSkill, Long> {

    List<AdminSkill> findByAdminSkillsCategory_Id(
            Long categoryId);

    Optional<AdminSkill> findByIdAndAdminSkillsCategory_Id(
            Long skillId,
            Long categoryId);
}
