package portfolio.utls;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import portfolio.dto.AdminExperienceRequestDTO;
import portfolio.model.AdminExperience;

@Mapper(componentModel = "spring")
public interface ExperienceUpdateMapper {
	
	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	
	
// Unmapped target properties: "admin, id".
	
//	This is expected. MapStruct is telling you:
//		Unmapped target properties: "admin, id"
//		because your AdminEducation entity has:
//
//		private Long id;
//		private Admin admin;
//
//		but your AdminEducationRequestDTO doesn't, so MapStruct doesn't know what to do with them.
	@Mapping(target = "id", ignore = true)
    @Mapping(target = "admin", ignore = true)
	void updateExperience(AdminExperienceRequestDTO adminExperienceRequestDTO, @MappingTarget AdminExperience experience);
}
