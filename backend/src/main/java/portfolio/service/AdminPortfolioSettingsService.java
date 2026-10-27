
package portfolio.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import portfolio.dto.AdminPortfolioSettingsRequestDTO;
import portfolio.dto.AdminPortfolioSettingsResponseDTO;
import portfolio.model.Admin;
import portfolio.model.AdminPortfolioSettings;
import portfolio.repository.AdminPortfolioSettingsRepository;
import portfolio.repository.AdminRepository;

@Service
public class AdminPortfolioSettingsService {

    private static final Set<String> ALLOWED_ACCENTS = Set.of(
            "MIDNIGHT_PARCHMENT",
            "TERRACOTTA",
            "LAGOON",
            "VERMILION"
    );

    private final AdminRepository adminRepository;
    private final AdminPortfolioSettingsRepository settingsRepository;

    public AdminPortfolioSettingsService(
            AdminRepository adminRepository,
            AdminPortfolioSettingsRepository settingsRepository) {
        this.adminRepository = adminRepository;
        this.settingsRepository = settingsRepository;
    }

    @Transactional
    public AdminPortfolioSettingsResponseDTO getSettings(
            String userName) {

        return toResponse(getOrCreateSettings(userName));
    }

    @Transactional
    public AdminPortfolioSettingsResponseDTO updateSettings(
            String userName,
            AdminPortfolioSettingsRequestDTO request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Settings request is required");
        }

        AdminPortfolioSettings settings =
                getOrCreateSettings(userName);

        if (request.getTheme() != null) {
            String theme = request.getTheme()
                    .trim()
                    .toUpperCase(Locale.ROOT);

            try {
                settings.setTheme(
                        AdminPortfolioSettings.Theme.valueOf(theme));
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException(
                        "Theme must be LIGHT or DARK");
            }
        }

        if (request.getAccentPalette() != null) {
            String accent = request.getAccentPalette()
                    .trim()
                    .toUpperCase(Locale.ROOT);

            if (!ALLOWED_ACCENTS.contains(accent)) {
                throw new IllegalArgumentException(
                        "Unsupported accent palette");
            }

            settings.setAccentPalette(accent);
        }

        if (request.getSectionVisibility() != null) {
            Map<String, Boolean> visibility =
                    new LinkedHashMap<>();

            request.getSectionVisibility().forEach((key, value) -> {
                if (key == null || key.isBlank() || value == null) {
                    throw new IllegalArgumentException(
                            "Section visibility contains an invalid entry");
                }

                visibility.put(key.trim(), value);
            });

            settings.setSectionVisibility(visibility);
        }

        if (request.getSectionOrder() != null) {
            List<String> order = new ArrayList<>();
            Set<String> uniqueSections = new HashSet<>();

            for (String section : request.getSectionOrder()) {
                if (section == null || section.isBlank()) {
                    throw new IllegalArgumentException(
                            "Section order contains an invalid entry");
                }

                String normalized = section.trim();

                if (!uniqueSections.add(normalized)) {
                    throw new IllegalArgumentException(
                            "Section order cannot contain duplicates");
                }

                order.add(normalized);
            }

            settings.setSectionOrder(order);
        }

        AdminPortfolioSettings saved =
                settingsRepository.save(settings);

        return toResponse(saved);
    }

    private AdminPortfolioSettings getOrCreateSettings(
            String userName) {

        Admin admin = adminRepository
                .findByAdminAuth_AdminUser(userName)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Admin profile not found"));

        return settingsRepository.findByAdmin_Id(admin.getId())
                .orElseGet(() -> {
                    AdminPortfolioSettings settings =
                            new AdminPortfolioSettings();
                    settings.setAdmin(admin);

                    return settingsRepository.save(settings);
                });
    }

    private AdminPortfolioSettingsResponseDTO toResponse(
            AdminPortfolioSettings settings) {

        return new AdminPortfolioSettingsResponseDTO(
                settings.getTheme().name(),
                settings.getAccentPalette(),
                new LinkedHashMap<>(
                        settings.getSectionVisibility()),
                new ArrayList<>(settings.getSectionOrder()),
                settings.getUpdatedAt()
        );
    }
}
