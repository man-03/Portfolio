package portfolio.dto;

public class AdminExperienceResponseDTO {

    private Long id;
    private String title;
    private String employmentType;
    private String company;
    private Short startMonth;
    private Short startYear;
    private Short endMonth;
    private Short endYear;
    private Boolean currentlyWorking;
    private String location;
    private String locationType;
    private String description;
    private String companyLogoUrl;
    private String adminUser;

    public AdminExperienceResponseDTO() {

    }

    public AdminExperienceResponseDTO(Long id, String title, String employmentType,
            String company, Short startMonth, Short startYear,
            Short endMonth, Short endYear, Boolean currentlyWorking,
            String location, String locationType, String description,
            String companyLogoUrl, String adminUser) {

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
        this.adminUser = adminUser;
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

    public String getAdminUser() {
        return adminUser;
    }
    public void setAdminUser(String adminUser) {
        this.adminUser = adminUser;
    }

    @Override
    public String toString() {
        return "AdminExperienceResponseDTO [id=" + id +
                ", title=" + title +
                ", employmentType=" + employmentType +
                ", company=" + company +
                ", startMonth=" + startMonth +
                ", startYear=" + startYear +
                ", endMonth=" + endMonth +
                ", endYear=" + endYear +
                ", currentlyWorking=" + currentlyWorking +
                ", location=" + location +
                ", locationType=" + locationType +
                ", description=" + description +
                ", companyLogoUrl=" + companyLogoUrl +
                ", adminUser=" + adminUser +
                "]";
    }
}