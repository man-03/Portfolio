package portfolio.utls;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import portfolio.dto.AdminEducationRequestDTO;
import portfolio.model.AdminEducation;

@Mapper(componentModel = "spring")
public interface EducationUpdateMapper {

	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	@Mapping(target = "id", ignore = true)
    @Mapping(target = "admin", ignore = true)
	void updateEducation(AdminEducationRequestDTO adminEducationRequestDTO, @MappingTarget AdminEducation adminEducation);
}
