package portfolio.controller;

import portfolio.dto.*;
import portfolio.service.authorizationService.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody LoginRequestDTO request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequestDTO request) {

        authService.generateResetToken(request.getEmail());

        return ResponseEntity.ok(
                "If the email is registered, a password reset link has been sent."
        );
    }

    @PostMapping("/reset-forgot-password")
    public ResponseEntity<String> resetForgotPassword(
            @RequestBody ResetPasswordRequestDTO request) {

        authService.resetForgotPassword(request);

        return ResponseEntity.ok(
                "Password has been reset successfully."
        );
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequestDTO request,
            Authentication authentication) {

        authService.changePassword(request, authentication);

        return ResponseEntity.ok("Password changed successfully.");
    }
}