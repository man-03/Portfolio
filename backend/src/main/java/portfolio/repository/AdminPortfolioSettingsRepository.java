
package portfolio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import portfolio.model.AdminPortfolioSettings;

public interface AdminPortfolioSettingsRepository extends JpaRepository<AdminPortfolioSettings, Long> {

    Optional<AdminPortfolioSettings> findByAdmin_Id(Long adminId);
}
