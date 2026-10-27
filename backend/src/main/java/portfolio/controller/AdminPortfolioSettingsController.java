
package portfolio.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import portfolio.dto.AdminPortfolioSettingsRequestDTO;
import portfolio.dto.AdminPortfolioSettingsResponseDTO;
import portfolio.service.AdminPortfolioSettingsService;

@RestController
@RequestMapping("/api/admin/{userName}/settings")
public class AdminPortfolioSettingsController {

    private final AdminPortfolioSettingsService settingsService;

    public AdminPortfolioSettingsController(
            AdminPortfolioSettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    @PreAuthorize(
            "@adminAuthorizationService.isCurrentAdmin(authentication, #userName)"
    )
    public ResponseEntity<AdminPortfolioSettingsResponseDTO> getSettings(
            @PathVariable String userName) {

        return ResponseEntity.ok(
                settingsService.getSettings(userName));
    }

    @PatchMapping
    @PreAuthorize(
            "@adminAuthorizationService.isCurrentAdmin(authentication, #userName)"
    )
    public ResponseEntity<AdminPortfolioSettingsResponseDTO> updateSettings(
            @PathVariable String userName,
            @RequestBody AdminPortfolioSettingsRequestDTO request) {

        return ResponseEntity.ok(
                settingsService.updateSettings(userName, request));
    }
}
