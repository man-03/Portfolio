package portfolio.utls;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import portfolio.dto.AdminProjectRequestDTO;
import portfolio.model.AdminProject;

@Mapper(componentModel = "spring")
public interface ProjectUpdateMapper {

	@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	@Mapping(target = "id", ignore=true)
	@Mapping(target = "admin", ignore=true)
	void updateProject(AdminProjectRequestDTO adminProjectRequestDTO, @MappingTarget AdminProject adminProject);
}
