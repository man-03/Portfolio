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
@Table(name="admin_experience")
public class AdminExperience {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="title")
	private String title;
	
	@Column(name="employment_type")
	private String employmentType;
	
	@Column(name="company")
	private String company;
	
	@Column(name="start_month")
	private Short startMonth;
	
	@Column(name="start_year")
	private Short startYear;
	
	@Column(name="end_month")
	private Short endMonth;
	
	@Column(name="end_year")
	private Short endYear;
	
	@Column(name="currently_working")
	private Boolean currentlyWorking;
	
	@Column(name="location")
	private String location;
	
	@Column(name="location_type")
	private String locationType;
	
	@Column(name="description")
	private String description;
	
	@Column(name="company_logo_url")
	private String companyLogoUrl;
	
	@ManyToOne
	@JoinColumn(name="admin_user")
	private Admin admin;
	
	public AdminExperience() {
		
	}
	
	public AdminExperience(Long id, String title, String employmentType, String company, Short startMonth, Short startYear, Short endMonth, Short endYear, Boolean currentlyWorking, String location, String locationType, String description, String companyLogoUrl, Admin admin) {
		this.id = id;
		this.title = title;
		this.employmentType = employmentType;
		this.company = company;
		this.startMonth = startMonth;
		this.startYear = startYear;
		this.endMonth = endMonth;
		this.endYear = endYear;
		this.currentlyWorking = currentlyWorking;
		this.location = location;
		this.locationType = locationType;
		this.description = description;
		this.companyLogoUrl = companyLogoUrl;
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
	
	public String getEmploymentType() {
		return employmentType;
	}
	public void setEmploymentType(String employmentType) {
		this.employmentType = employmentType;
	}
	
	public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
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
	
	public Boolean getCurrentlyWorking() {
		return currentlyWorking;
	}
	public void setCurrentlyWorking(Boolean currentlyWorking) {
		this.currentlyWorking = currentlyWorking;
	}
	
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	
	public String getLocationType() {
		return locationType;
	}
	public void setLocationType(String locationType) {
		this.locationType = locationType;
	}
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public String getCompanyLogoUrl() {
		return companyLogoUrl;
	}
	public void setCompanyLogoUrl(String companyLogoUrl) {
		this.companyLogoUrl = companyLogoUrl;
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
		if(!(o instanceof AdminExperience)) return false;
		AdminExperience experience = (AdminExperience) o;
		return Objects.equals(id, experience.id);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
	
	@Override
	public String toString() {
		return "AdminExperience [id=" + id + ", title=" + title + ", employmentType=" + employmentType +
				            ", company=" + company + ", startMonth=" + startMonth  + ", startYear=" + startYear + 
				            ", endMonth=" + endMonth + ", endYear=" + endYear + ", currentlyWorking=" + currentlyWorking +
				            ", location=" + location + ", locationType=" + locationType + ", description=" + description +
				            ", companyLogoUrl=" + companyLogoUrl + ", admin=" + admin + "]";
	}
}