package portfolio.dto;

public class AdminProjectRequestDTO {

    private String title;
    private String projectDescription;
    private String rolesAndResponsibilities;
    private Short startMonth;
    private Short startYear;
    private Short endMonth;
    private Short endYear;
    private String techStack;

    public AdminProjectRequestDTO() {

    }

    public AdminProjectRequestDTO(String title, String projectDescription,
                              String rolesAndResponsibilities,
                              Short startMonth, Short startYear,
                              Short endMonth, Short endYear,
                              String techStack) {

        this.title = title;
        this.projectDescription = projectDescription;
        this.rolesAndResponsibilities = rolesAndResponsibilities;
        this.startMonth = startMonth;
        this.startYear = startYear;
        this.endMonth = endMonth;
        this.endYear = endYear;
        this.techStack = techStack;
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

    @Override
    public String toString() {
        return "AdminProjectRequestDTO [title=" + title +
                ", projectDescription=" + projectDescription +
                ", rolesAndResponsibilities=" + rolesAndResponsibilities +
                ", startMonth=" + startMonth +
                ", startYear=" + startYear +
                ", endMonth=" + endMonth +
                ", endYear=" + endYear +
                ", techStack=" + techStack + "]";
    }
}