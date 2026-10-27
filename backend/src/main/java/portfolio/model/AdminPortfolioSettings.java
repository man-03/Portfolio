
package portfolio.model;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.*;

@Entity
@Table(name = "admin_portfolio_settings")
@DynamicUpdate
public class AdminPortfolioSettings {

    public enum Theme {
        LIGHT, DARK
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "admin_profile_id",
            nullable = false,
            unique = true
    )
    private Admin admin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Theme theme = Theme.LIGHT;

    @Column(name = "accent_palette", nullable = false, length = 30)
    private String accentPalette = "MIDNIGHT_PARCHMENT";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "section_visibility", nullable = false,
            columnDefinition = "jsonb")
    private Map<String, Boolean> sectionVisibility =
            new LinkedHashMap<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "section_order", nullable = false,
            columnDefinition = "jsonb")
    private List<String> sectionOrder = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public AdminPortfolioSettings() {
    }

    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();

        if (createdAt == null) createdAt = now;
        updatedAt = now;

        if (theme == null) theme = Theme.LIGHT;
        if (accentPalette == null) {
            accentPalette = "MIDNIGHT_PARCHMENT";
        }
        if (sectionVisibility == null) {
            sectionVisibility = new LinkedHashMap<>();
        }
        if (sectionOrder == null) {
            sectionOrder = new ArrayList<>();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) { this.admin = admin; }

    public Theme getTheme() { return theme; }
    public void setTheme(Theme theme) { this.theme = theme; }

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

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
