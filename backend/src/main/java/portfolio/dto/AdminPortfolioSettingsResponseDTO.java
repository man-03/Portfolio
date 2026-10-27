
package portfolio.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

public class AdminPortfolioSettingsResponseDTO {

    private String theme;
    private String accentPalette;
    private Map<String, Boolean> sectionVisibility;
    private List<String> sectionOrder;
    private OffsetDateTime updatedAt;

    public AdminPortfolioSettingsResponseDTO() {
    }

    public AdminPortfolioSettingsResponseDTO(
            String theme,
            String accentPalette,
            Map<String, Boolean> sectionVisibility,
            List<String> sectionOrder,
            OffsetDateTime updatedAt) {

        this.theme = theme;
        this.accentPalette = accentPalette;
        this.sectionVisibility = sectionVisibility;
        this.sectionOrder = sectionOrder;
        this.updatedAt = updatedAt;
    }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public String getAccentPalette() { return accentPalette; }
    public void setAccentPalette(String accentPalette) {
        this.accentPalette = accentPalette;
    }

    public Map<String, Boolean> getSectionVisibility() {
        return sectionVisibility;
    }

    public void setSectionVisibility(
            Map<String, Boolean> sectionVisibility) {
        this.sectionVisibility = sectionVisibility;
    }

    public List<String> getSectionOrder() { return sectionOrder; }
    public void setSectionOrder(List<String> sectionOrder) {
        this.sectionOrder = sectionOrder;
    }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
