package portfolio.dto;

public class AdminProjectResponseDTO {

    private Long id;
    private String title;
    private String projectDescription;
    private String rolesAndResponsibilities;
    private Short startMonth;
    private Short startYear;
    private Short endMonth;
    private Short endYear;
    private String techStack;
    private String adminUser;

    public AdminProjectResponseDTO() {

    }

    public AdminProjectResponseDTO(Long id, String title,
                               String projectDescription,
                               String rolesAndResponsibilities,
                               Short startMonth,
                               Short startYear,
                               Short endMonth,
                               Short endYear,
                               String techStack,
                               String adminUser) {

        this.id = id;
        this.title = title;
        this.projectDescription = projectDescription;
        this.rolesAndResponsibilities = rolesAndResponsibilities;
        this.startMonth = startMonth;
        this.startYear = startYear;
        this.endMonth = endMonth;
        this.endYear = endYear;
        this.techStack = techStack;
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

    public String getTechStack() {
        return techStack;
    }
    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }

    public String getAdminUser() {
        return adminUser;
    }
    public void setAdminUser(String adminUser) {
        this.adminUser = adminUser;
    }

    @Override
    public String toString() {
        return "AdminProjectResponseDTO [id=" + id +
                ", title=" + title +
                ", projectDescription=" + projectDescription +
                ", rolesAndResponsibilities=" + rolesAndResponsibilities +
                ", startMonth=" + startMonth +
                ", startYear=" + startYear +
                ", endMonth=" + endMonth +
                ", endYear=" + endYear +
                ", techStack=" + techStack +
                ", adminUser=" + adminUser + "]";
    }
}
