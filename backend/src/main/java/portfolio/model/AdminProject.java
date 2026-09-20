package portfolio.model;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="admin_project")
public class AdminProject {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="title")
	private String title;
	
	@Column(name="project_description")
	private String projectDescription;
	
	@Column(name="roles_and_responsibilities")
	private String rolesAndResponsibilities;
	
	@Column(name="start_month")
	private Short startMonth;
	
	@Column(name="start_year")
    private Short startYear;
	
	@Column(name="end_month")
    private Short endMonth;
	
	@Column(name="end_year")
    private Short endYear;
	
	@Column(name="tech_stack")
    private String techStack;
	
    @ManyToOne
    @JoinColumn(name="admin_user")
    private Admin admin;
    
    
    public AdminProject() {
    	
    }
    
    public AdminProject(Long id, String title, Short startMonth,
    		String projectDescription, String rolesAndResponsibilities,
    	    Short startYear, Short endMonth,
    	    Short endYear, String techStack, Admin admin) {
    	this.id = id;
    	this.title = title;
    	this.projectDescription = projectDescription;
    	this.rolesAndResponsibilities = rolesAndResponsibilities;
	    this.startMonth = startMonth;
	    this.startYear = startYear;
	    this.endMonth = endMonth;
	    this.endYear = endYear;
	    this.techStack = techStack;
	    this.admin = admin;
    }
    
    
    public Long getId() {
    	return id;
    }
    public void setId(Long id) {
    	this.id = id;
    }
    
    public String getTitle() {
    	return title;
    }
    public void setTitle(String title) {
    	this.title = title;
    }
    
    public String getProjectDescription() {
    	return projectDescription;
    }
    public void setProjectDescription(String projectDescription) {
    	this.projectDescription = projectDescription;
    }
    
    public String getRolesAndResponsibilities() {
    	return rolesAndResponsibilities;
    }
    public void setRolesAndResponsibilities(String rolesAndResponsibilities) {
    	this.rolesAndResponsibilities = rolesAndResponsibilities;
    }
    
    public Short getStartMonth() {
        return startMonth;
    }

    public void setStartMonth(Short startMonth) {
        this.startMonth = startMonth;
    }

    public Short getStartYear() {
        return startYear;
    }

    public void setStartYear(Short startYear) {
        this.startYear = startYear;
    }

    public Short getEndMonth() {
        return endMonth;
    }

    public void setEndMonth(Short endMonth) {
        this.endMonth = endMonth;
    }

    public Short getEndYear() {
        return endYear;
    }

    public void setEndYear(Short endYear) {
        this.endYear = endYear;
    }
    
    public String gettechStack() {
    	return techStack;
    }
    public void setTechStack(String techStack) {
    	this.techStack = techStack;
    }
    
    public Admin getAdmin() {
    	return admin;
    }
    public void setAdmin(Admin admin) {
    	this.admin = admin;
    }
    
    @Override
    public boolean equals(Object o) {
    	if(this == o) return true;
    	if(!(o instanceof AdminProject)) return false;
    	AdminProject project = (AdminProject) o;
    	return Objects.equals(id, project.id);
    }
    
    @Override
    public int hashCode() {
    	return Objects.hash(id);
    }
	
    @Override
    public String toString() {
    	return "AdminProject [id=" + id + ", title=" + title +
    			", projectDescription=" + projectDescription +
    			", rolesAndResponsibilities=" + rolesAndResponsibilities +
    			", startMonth=" + startMonth + ", startYear=" + startYear +
				", endMonth=" + endMonth + ", endYear=" + endYear +
				", techStack=" + techStack + ", Admin=" + admin + "]";
    }
}
