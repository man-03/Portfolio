
package portfolio.dto;

import java.util.List;
import java.util.Map;

public class AdminPortfolioSettingsRequestDTO {

    private String theme;
    private String accentPalette;
    private Map<String, Boolean> sectionVisibility;
    private List<String> sectionOrder;

    public AdminPortfolioSettingsRequestDTO() {
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
}
