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
@Table(name="admin_education")
public class AdminEducation {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="degree")
	private String degree;
	
	@Column(name="school")
	private String school;
	
	@Column(name="university")
	private String university;
	
	@Column(name="field_of_study")
	private String fieldOfStudy;
	
	@Column(name="start_month")
	private Short startMonth;
	
	@Column(name="start_year")
	private Short startYear;
	
	@Column(name="end_month")
	private Short endMonth;
	
	@Column(name="end_year")
	private Short endYear;
	
	@Column(name="grade")
	private String grade;
	
	@Column(name="description")
	private String description;
	
	@Column(name="skills")
	private String skills;
	
	@Column(name="activities")
	private String activities;
	
	@Column(name="school_logo_url")
	private String schoolLogoUrl;
	
	@ManyToOne
	@JoinColumn(name="admin_user")
	private Admin admin;

	public AdminEducation() {
		
	}
	
	public AdminEducation(Long id, String degree, String school, String university, String fieldOfStudy, Short startMonth, Short startYear, Short endMonth, Short endYear, String grade, String description, String skills, String activities, String schoolLogoUrl, Admin admin) {
		this.id = id;
		this.degree = degree;
		this.school = school;
		this.university = university;
		this.fieldOfStudy = fieldOfStudy;
		this.startMonth = startMonth;
		this.startYear = startYear;
		this.endMonth = endMonth;
		this.endYear = endYear;
		this.grade = grade;
		this.description = description;
		this.skills = skills;
		this.activities = activities;
		this.schoolLogoUrl = schoolLogoUrl;
		this.admin = admin;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getDegree() {
		return degree;
	}
	public void setDegree(String degree) {
		this.degree = degree;
	}
	
	public String getSchool() {
		return school;
	}
	public void setSchool(String school) {
		this.school = school;
	}
	
	public String getUniversity() {
		return university;
	}
	public void setUniversity(String university) {
		this.university = university;
	}
	
	public String getFieldOfStudy() {
		return fieldOfStudy;
	}
	public void setFieldOfStudy(String fieldOfStudy) {
		this.fieldOfStudy = fieldOfStudy;
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
	
	public String getGrade() {
		return grade;
	}
	public void setGrade(String grade) {
		this.grade = grade;
	}
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public String getSkills() {
		return skills;
	}
	public void setSkills(String skills) {
		this.skills = skills;
	}
	
	public String getActivities() {
		return activities;
	}
	public void setActivities(String activities) {
		this.activities = activities;
	}
	
	public String getSchoolLogoUrl() {
		return schoolLogoUrl;
	}
	public void setSchoolLogoUrl(String schoolLogoUrl) {
		this.schoolLogoUrl = schoolLogoUrl;
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
		if(!(o instanceof AdminEducation)) return false;
		AdminEducation education = (AdminEducation) o;
		return Objects.equals(id, education.id);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
	
	@Override
	public String toString() {
		return "AdminEducation [id=" + id +
				", degree=" + degree +
				", school=" + school +
				", university=" + school +
				", fieldOfStudy=" + fieldOfStudy +
				", startMonth=" + startMonth +
				", startYear=" + startYear +
				", endMonth=" + endMonth +
				", endYear=" + endYear +
				", grade=" + grade +
				", description=" + description +
				", skills=" + skills +
				", activities=" + activities +
				", schoolLogoUrl=" + schoolLogoUrl + 
				", admin=" + admin + "]";
	}
	
	
}
