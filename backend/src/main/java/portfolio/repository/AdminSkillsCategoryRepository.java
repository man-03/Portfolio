package portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import portfolio.model.AdminSkillsCategory;

@Repository
public interface AdminSkillsCategoryRepository extends JpaRepository<AdminSkillsCategory, Long>{
	List<AdminSkillsCategory> findByAdmin_UserName(String userName);

    Optional<AdminSkillsCategory> findByIdAndAdmin_UserName(
            Long id,
            String userName);
}