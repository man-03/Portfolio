package portfolio.dto;

public class AdminActivityResponseDTO {

    private Long id;
    private String activityDescription;
    private String activityMediaUrl;
    private String adminUser;

    public AdminActivityResponseDTO() {

    }

    public AdminActivityResponseDTO(Long id, String activityDescription,
                                    String activityMediaUrl, String adminUser) {
        this.id = id;
        this.activityDescription = activityDescription;
        this.activityMediaUrl = activityMediaUrl;
        this.adminUser = adminUser;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActivityDescription() {
        return activityDescription;
    }

    public void setActivityDescription(String activityDescription) {
        this.activityDescription = activityDescription;
    }

    public String getActivityMediaUrl() {
        return activityMediaUrl;
    }

    public void setActivityMediaUrl(String activityMediaUrl) {
        this.activityMediaUrl = activityMediaUrl;
    }

    public String getAdminUser() {
        return adminUser;
    }

    public void setAdminUser(String adminUser) {
        this.adminUser = adminUser;
    }

    @Override
    public String toString() {
        return "AdminActivityResponseDTO [id=" + id +
                ", activityDescription=" + activityDescription +
                ", activityMediaUrl=" + activityMediaUrl +
                ", adminUser=" + adminUser + "]";
    }
}