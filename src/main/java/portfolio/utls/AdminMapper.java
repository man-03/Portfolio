package portfolio.utls;

import java.beans.PropertyDescriptor;
import java.util.Map;

import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.stereotype.Component;

import portfolio.dto.AdminActivityRequestDTO;
import portfolio.dto.AdminActivityResponseDTO;
import portfolio.dto.AdminAddressRequestDTO;
import portfolio.dto.AdminAddressResponseDTO;
import portfolio.dto.AdminContactRequestDTO;
import portfolio.dto.AdminContactResponseDTO;
import portfolio.dto.AdminEducationRequestDTO;
import portfolio.dto.AdminEducationResponseDTO;
import portfolio.dto.AdminExperienceRequestDTO;
import portfolio.dto.AdminExperienceResponseDTO;
import portfolio.dto.AdminLinkRequestDTO;
import portfolio.dto.AdminLinkResponseDTO;
import portfolio.dto.AdminProjectRequestDTO;
import portfolio.dto.AdminProjectResponseDTO;
import portfolio.dto.AdminRequestDTO;
import portfolio.dto.AdminResponseDTO;
import portfolio.dto.LicenseAndCertificationRequestDTO;
import portfolio.dto.LicenseAndCertificationResponseDTO;
import portfolio.model.Admin;
import portfolio.model.AdminActivity;
import portfolio.model.AdminAddress;
import portfolio.model.AdminContact;
import portfolio.model.AdminEducation;
import portfolio.model.AdminExperience;
import portfolio.model.AdminLink;
import portfolio.model.AdminProject;
import portfolio.model.LicenseAndCertification;

@Component
public class AdminMapper {

	//Admin
    public Admin convertDTOToAdmin(AdminRequestDTO dto) {

        Admin admin = new Admin();

        admin.setUserName(dto.getUserName());
        admin.setFirstName(dto.getFirstName());
        admin.setLastName(dto.getLastName());
        admin.setDateOfBirth(dto.getDateOfBirth());
        admin.setPronoun(dto.getPronoun());
        admin.setCurrentPosition(dto.getCurrentPosition());
        admin.setMyQuote(dto.getMyQuote());
        admin.setHeadLine(dto.getHeadLine());
        admin.setAbout(dto.getAbout());
        admin.setProfileImageUrl(dto.getProfileImageUrl());
        admin.setPassword(dto.getPassword());

        return admin;
    }

    public AdminResponseDTO convertAdminToDTO(Admin admin, AdminAddressResponseDTO adminAddressResponseDTO) {

        AdminResponseDTO dto = new AdminResponseDTO();

        dto.setUserName(admin.getUserName());
        dto.setFirstName(admin.getFirstName());
        dto.setLastName(admin.getLastName());
        dto.setDateOfBirth(admin.getDateOfBirth());
        dto.setPronoun(admin.getPronoun());
        dto.setCurrentPosition(admin.getCurrentPosition());
        dto.setMyQuote(admin.getMyQuote());
        dto.setHeadLine(admin.getHeadLine());
        dto.setAbout(admin.getAbout());
        dto.setProfileImageUrl(admin.getProfileImageUrl());
        dto.setAdminAddressResponseDTO(adminAddressResponseDTO);

        return dto;
    }

    public void updateAdmin(AdminRequestDTO dto, Admin admin) {

        if (dto.getFirstName() != null) {
            admin.setFirstName(dto.getFirstName());
        }

        if (dto.getLastName() != null) {
            admin.setLastName(dto.getLastName());
        }

        if (dto.getDateOfBirth() != null) {
            admin.setDateOfBirth(dto.getDateOfBirth());
        }

        if (dto.getPronoun() != null) {
            admin.setPronoun(dto.getPronoun());
        }

        if (dto.getCurrentPosition() != null) {
            admin.setCurrentPosition(dto.getCurrentPosition());
        }

        if (dto.getMyQuote() != null) {
            admin.setMyQuote(dto.getMyQuote());
        }

        if (dto.getHeadLine() != null) {
            admin.setHeadLine(dto.getHeadLine());
        }

        if (dto.getAbout() != null) {
            admin.setAbout(dto.getAbout());
        }
        
        if (dto.getProfileImageUrl() != null) {
        	admin.setProfileImageUrl(dto.getProfileImageUrl());
        }

        if (dto.getPassword() != null) {
            admin.setPassword(dto.getPassword());
        }
    }
    
    public AdminAddress convertDTOToAddress(AdminAddressRequestDTO adminAddressRequestDTO) {
    	
    	AdminAddress adminAddress = new AdminAddress();
    	
    	adminAddress.setAddress(adminAddressRequestDTO.getAddress());
    	adminAddress.setCountry(adminAddressRequestDTO.getCountry());
    	adminAddress.setState(adminAddressRequestDTO.getState());
    	adminAddress.setCity(adminAddressRequestDTO.getCity());
    	adminAddress.setZip(adminAddressRequestDTO.getZip());
    	
    	return adminAddress;
    }
    
    public AdminAddressResponseDTO convertAddressToDTO(AdminAddress adminAddress) {

        AdminAddressResponseDTO dto = new AdminAddressResponseDTO();

        dto.setId(adminAddress.getId());
        dto.setAddress(adminAddress.getAddress());
        dto.setCountry(adminAddress.getCountry());
        dto.setState(adminAddress.getState());
        dto.setCity(adminAddress.getCity());
        dto.setZip(adminAddress.getZip());

        return dto;
    }
    
    public void updateAddress(AdminAddressRequestDTO dto, AdminAddress adminAddress) {

		if (dto.getAddress() != null) {
		adminAddress.setAddress(dto.getAddress());
		}
		
		if (dto.getCountry() != null) {
		adminAddress.setCountry(dto.getCountry());
		}
		
		if (dto.getState() != null) {
		adminAddress.setState(dto.getState());
		}
		
		if (dto.getCity() != null) {
		adminAddress.setCity(dto.getCity());
		}
		
		if (dto.getZip() != null) {
		adminAddress.setZip(dto.getZip());
		}
	}
    
    
    public AdminExperience convertDTOToAdminExperience(AdminExperienceRequestDTO dto) {

        AdminExperience experience = new AdminExperience();

        experience.setTitle(dto.getTitle());
        experience.setEmploymentType(dto.getEmploymentType());
        experience.setCompany(dto.getCompany());
        experience.setStartMonth(dto.getStartMonth());
        experience.setStartYear(dto.getStartYear());
        experience.setEndMonth(dto.getEndMonth());
        experience.setEndYear(dto.getEndYear());
        experience.setCurrentlyWorking(dto.getCurrentlyWorking());
        experience.setLocation(dto.getLocation());
        experience.setLocationType(dto.getLocationType());
        experience.setDescription(dto.getDescription());
        experience.setCompanyLogoUrl(dto.getCompanyLogoUrl());

        return experience;
    }
    
    public AdminExperienceResponseDTO convertAdminExperienceToDTO(AdminExperience experience) {

        AdminExperienceResponseDTO dto = new AdminExperienceResponseDTO();

        dto.setId(experience.getId());
        dto.setTitle(experience.getTitle());
        dto.setEmploymentType(experience.getEmploymentType());
        dto.setCompany(experience.getCompany());
        dto.setStartMonth(experience.getStartMonth());
        dto.setStartYear(experience.getStartYear());
        dto.setEndMonth(experience.getEndMonth());
        dto.setEndYear(experience.getEndYear());
        dto.setCurrentlyWorking(experience.getCurrentlyWorking());
        dto.setLocation(experience.getLocation());
        dto.setLocationType(experience.getLocationType());
        dto.setDescription(experience.getDescription());
        dto.setCompanyLogoUrl(experience.getCompanyLogoUrl());

        if (experience.getAdmin() != null) {
            dto.setAdminUser(experience.getAdmin().getUserName());
        }

        return dto;
    }
    
    public AdminEducation convertDTOToAdminEducation(AdminEducationRequestDTO dto) {

        AdminEducation education = new AdminEducation();

        education.setDegree(dto.getDegree());
        education.setSchool(dto.getSchool());
        education.setUniversity(dto.getUniversity());
        education.setFieldOfStudy(dto.getFieldOfStudy());
        education.setStartMonth(dto.getStartMonth());
        education.setStartYear(dto.getStartYear());
        education.setEndMonth(dto.getEndMonth());
        education.setEndYear(dto.getEndYear());
        education.setGrade(dto.getGrade());
        education.setDescription(dto.getDescription());
        education.setSkills(dto.getSkills());
        education.setActivities(dto.getActivities());
        education.setSchoolLogoUrl(dto.getSchoolLogoUrl());

        return education;
    }
    
    public AdminEducationResponseDTO convertAdminEducationToDTO(AdminEducation education) {

        AdminEducationResponseDTO dto = new AdminEducationResponseDTO();

        dto.setId(education.getId());
        dto.setDegree(education.getDegree());
        dto.setSchool(education.getSchool());
        dto.setUniversity(education.getUniversity());
        dto.setFieldOfStudy(education.getFieldOfStudy());
        dto.setStartMonth(education.getStartMonth());
        dto.setStartYear(education.getStartYear());
        dto.setEndMonth(education.getEndMonth());
        dto.setEndYear(education.getEndYear());
        dto.setGrade(education.getGrade());
        dto.setDescription(education.getDescription());
        dto.setSkills(education.getSkills());
        dto.setActivities(education.getActivities());
        dto.setSchoolLogoUrl(education.getSchoolLogoUrl());

        if (education.getAdmin() != null) {
            dto.setAdminUser(education.getAdmin().getUserName());
        }

        return dto;
    }
    
    public AdminProject convertDTOToAdminProject(AdminProjectRequestDTO dto) {

        AdminProject project = new AdminProject();

        project.setTitle(dto.getTitle());
        project.setProjectDescription(dto.getProjectDescription());
        project.setRolesAndResponsibilities(dto.getRolesAndResponsibilities());
        project.setStartMonth(dto.getStartMonth());
        project.setStartYear(dto.getStartYear());
        project.setEndMonth(dto.getEndMonth());
        project.setEndYear(dto.getEndYear());
        project.setTechStack(dto.getTechStack());

        return project;
    }
    
    public AdminProjectResponseDTO convertAdminProjectToDTO(AdminProject project) {

        AdminProjectResponseDTO dto = new AdminProjectResponseDTO();

        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setProjectDescription(project.getProjectDescription());
        dto.setRolesAndResponsibilities(project.getRolesAndResponsibilities());
        dto.setStartMonth(project.getStartMonth());
        dto.setStartYear(project.getStartYear());
        dto.setEndMonth(project.getEndMonth());
        dto.setEndYear(project.getEndYear());
        dto.setTechStack(project.gettechStack());

        if (project.getAdmin() != null) {
            dto.setAdminUser(project.getAdmin().getUserName());
        }

        return dto;
    }
    
    public LicenseAndCertification convertDTOToLicenseAndCertification(
            LicenseAndCertificationRequestDTO dto) {

        LicenseAndCertification landc = new LicenseAndCertification();

        landc.setName(dto.getName());
        landc.setIssuingOrganisation(dto.getIssuingOrganisation());
        landc.setStartMonth(dto.getStartMonth());
        landc.setStartYear(dto.getStartYear());
        landc.setEndMonth(dto.getEndMonth());
        landc.setEndYear(dto.getEndYear());
        landc.setCredentialId(dto.getCredentialId());
        landc.setCredentialUrl(dto.getCredentialUrl());
        landc.setLandcUrl(dto.getLandcUrl());
        landc.setOrgLogoUrl(dto.getOrgLogoUrl());

        return landc;
    }
    
    public LicenseAndCertificationResponseDTO convertLicenseAndCertificationToDTO(
            LicenseAndCertification landc) {

        LicenseAndCertificationResponseDTO dto =
                new LicenseAndCertificationResponseDTO();

        dto.setId(landc.getId());
        dto.setName(landc.getName());
        dto.setIssuingOrganisation(landc.getIssuingOrganisation());
        dto.setStartMonth(landc.getStartMonth());
        dto.setStartYear(landc.getStartYear());
        dto.setEndMonth(landc.getEndMonth());
        dto.setEndYear(landc.getEndYear());
        dto.setCredentialId(landc.getCredentialId());
        dto.setCredentialUrl(landc.getCredentialUrl());
        dto.setLandcUrl(landc.getLandcUrl());
        dto.setOrgLogoUrl(landc.getOrgLogoUrl());

        if (landc.getAdmin() != null) {
            dto.setAdminUser(landc.getAdmin().getUserName());
        }

        return dto;
    }
    
    public AdminActivity convetDTOToAdminActivity(AdminActivityRequestDTO dto) {
    	
    	AdminActivity activity = new AdminActivity();
    	
    	activity.setActivityDescription(dto.getActivityDescription());
    	activity.setActivityMediaUrl(dto.getActivityMediaUrl());
    	
    	return activity;
    }
    
    public AdminActivityResponseDTO convertAdminActivityToDTO(AdminActivity activity) {
    	
    	AdminActivityResponseDTO dto = new AdminActivityResponseDTO();
    	
    	dto.setId(activity.getId());
    	dto.setActivityDescription(activity.getActivityDescription());
    	dto.setActivityMediaUrl(activity.getActivityMediaUrl());
    	
    	if(activity.getAdmin() != null) {
    		dto.setAdminUser(activity.getAdmin().getUserName());
    	}
    	
    	return dto;
    }
    
    public void updateAdminActivity(Map<String, Object> requestBody, AdminActivity activity) {
    	
    	requestBody.forEach((key, value) -> {		
    		switch(key) {
    		case"activityDescription":
    			activity.setActivityDescription((String)value);
    			break;
    		case"activityMediaUrl":
				activity.setActivityMediaUrl((String)value);
				break;
			default:
				break;
    		}
    	});
    }
    
    public AdminContact convertDTOToAdminContact(AdminContactRequestDTO dto) {
    	
    	AdminContact contact = new AdminContact();
    	
    	contact.setEmail(dto.getEmail());
    	contact.setPhone(dto.getPhone());
    	
    	return contact;
    }
    
    public AdminContactResponseDTO convertAdminContactToDTO(AdminContact contact) {
    	
    	AdminContactResponseDTO dto = new AdminContactResponseDTO();
    	
    	dto.setId(contact.getId());
    	dto.setEmail(contact.getEmail());
    	dto.setPhone(contact.getPhone());
    	
    	if(contact.getAdmin() != null) {
    		dto.setAdminUser(contact.getAdmin().getUserName());
    	}
    	
    	return dto;
    }
    
    public void updateAdminContact(AdminContactRequestDTO adminContactRequestDTO, AdminContact adminContact) {
    	
    	BeanWrapper source = new BeanWrapperImpl(adminContactRequestDTO);
    	BeanWrapper target = new BeanWrapperImpl(adminContact);
    	
    	for(PropertyDescriptor pd: source.getPropertyDescriptors()) {
    		
    		String property = pd.getName();
    		
    		if("class".equals("property")) {
    			continue;
    		}
    		
    		Object value = source.getPropertyValue(property);
    		
    		if(value != null && target.isWritableProperty(property)) {
    			target.setPropertyValue(property, value);
    		}
    	}
    }
    
    public AdminLink convertDTOToAdminLink(AdminLinkRequestDTO dto) {
    	
    	AdminLink link = new AdminLink();
    	
    	link.setPlatform(dto.getPlatform());
    	link.setUrl(dto.getUrl());
    	
    	return link;
    }
    
	public AdminLinkResponseDTO convertAdminLinkToDTO(AdminLink link) {
	    	
    	AdminLinkResponseDTO dto = new AdminLinkResponseDTO();
    	
    	dto.setId(link.getId());
    	dto.setPlatform(link.getPlatform());
    	dto.setUrl(link.getUrl());
    	
    	if(link.getAdmin() != null) {
    		dto.setAdminUser(link.getAdmin().getUserName());
    	}
    	
    	return dto;
	}
	
	public void updateAdminLink(Map<String, Object> requestBody, AdminLink link) {
		
		BeanWrapper beanWrapper = new BeanWrapperImpl(link);
		
		requestBody.forEach((key, value) -> {
			if(beanWrapper.isWritableProperty(key)) {
				beanWrapper.setPropertyValue(key, value);
			}
		});
	}
}
