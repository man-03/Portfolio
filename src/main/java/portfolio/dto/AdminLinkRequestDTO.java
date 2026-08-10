package portfolio.dto;

public class AdminLinkRequestDTO {

    private String platform;
    private String url;

    public AdminLinkRequestDTO() {

    }

    public AdminLinkRequestDTO(String platform, String url) {
        this.platform = platform;
        this.url = url;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public String toString() {
        return "AdminLinksRequestDTO [platform=" + platform +
                ", url=" + url + "]";
    }
}
