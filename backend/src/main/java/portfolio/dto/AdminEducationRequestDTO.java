package portfolio.dto;

public class AdminEducationRequestDTO {

    private String degree;
    private String school;
    private String university;
    private String fieldOfStudy;
    private Short startMonth;
    private Short startYear;
    private Short endMonth;
    private Short endYear;
    private String grade;
    private String description;
    private String skills;
    private String activities;
    private String schoolLogoUrl;

    public AdminEducationRequestDTO() {

    }

    public AdminEducationRequestDTO(String degree, String school, String university,
                               String fieldOfStudy, Short startMonth,
                               Short startYear, Short endMonth,
                               Short endYear, String grade,
                               String description, String skills,
                               String activities, String schoolLogoUrl) {

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

    @Override
    public String toString() {
        return "AdminEducationRequestDTO [degree=" + degree +
                ", school=" + school +
                ", university=" + university +
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
                "]";
    }
}