package portfolio.dto;

public class AdminActivityResponseDTO {

    private Long id;
    private String activityDescription;
    private String activityMediaUrl;

    public AdminActivityResponseDTO() {

    }

    public AdminActivityResponseDTO(Long id, String activityDescription,
                                    String activityMediaUrl) {
        this.id = id;
        this.activityDescription = activityDescription;
        this.activityMediaUrl = activityMediaUrl;
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

    @Override
    public String toString() {
        return "AdminActivityResponseDTO [id=" + id +
                ", activityDescription=" + activityDescription +
                ", activityMediaUrl=" + activityMediaUrl + "]";
    }
}