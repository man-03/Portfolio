package portfolio.dto;

public class AdminActivityRequestDTO {

    private String activityDescription;
    private String activityMediaUrl;

    public AdminActivityRequestDTO() {

    }

    public AdminActivityRequestDTO(String activityDescription, String activityMediaUrl) {
        this.activityDescription = activityDescription;
        this.activityMediaUrl = activityMediaUrl;
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
        return "AdminActivityRequestDTO [activityDescription=" + activityDescription +
                ", activityMediaUrl=" + activityMediaUrl + "]";
    }
}