package portfolio.dto;

public class AdminLinkResponseDTO {

    private Long id;
    private String platform;
    private String url;

    public AdminLinkResponseDTO() {

    }

    public AdminLinkResponseDTO(Long id, String platform, String url) {
        this.id = id;
        this.platform = platform;
        this.url = url;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
        return "AdminLinksResponseDTO [id=" + id +
                ", platform=" + platform +
                ", url=" + url + "]";
    }
}