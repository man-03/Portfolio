package portfolio.utls;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import portfolio.dto.LicenseAndCertificationRequestDTO;
import portfolio.model.LicenseAndCertification;

@Mapper(componentModel = "spring")
public interface LicenseAndCertificationUpdateMapper {
	
	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	@Mapping(target="id", ignore=true)
	@Mapping(target="admin", ignore=true)
	void updateLicenseAndCertification(LicenseAndCertificationRequestDTO licenseAndCertificationRequestDTO, @MappingTarget  LicenseAndCertification licenseAndCertification);
}
