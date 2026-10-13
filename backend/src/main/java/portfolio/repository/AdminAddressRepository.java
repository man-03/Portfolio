package portfolio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import portfolio.model.AdminAddress;

@Repository
public interface AdminAddressRepository extends JpaRepository<AdminAddress, Long> {
	Optional<AdminAddress> findByAdmin_Id(Long adminProfileId);
}