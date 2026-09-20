package portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import portfolio.model.LicenseAndCertification;

@Repository
public interface LicenseAndCertificationRepository extends JpaRepository<LicenseAndCertification, Long> {

	List<LicenseAndCertification> findByAdmin_UserName(String userName);
	Optional<LicenseAndCertification> findByIdAndAdmin_UserName(Long credentialId, String userName);
}
