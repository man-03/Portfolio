package portfolio.service.authorizationService;

import portfolio.dto.LoginRequestDTO;
import portfolio.dto.LoginResponseDTO;
import portfolio.dto.ResetPasswordRequestDTO;
import portfolio.model.AdminAuth;
import portfolio.repository.AdminAuthRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import portfolio.dto.ChangePasswordRequestDTO;
import org.springframework.security.core.Authentication;

import portfolio.service.EmailService;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AdminAuthRepository adminAuthRepository;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            AdminAuthRepository adminAuthRepository,
            JwtService jwtService,
            EmailService emailService,
            PasswordEncoder passwordEncoder) {

        this.authenticationManager = authenticationManager;
        this.adminAuthRepository = adminAuthRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        AdminAuth adminAuth = adminAuthRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        String token = jwtService.generateToken(
                adminAuth.getEmail()
        );

        String userName = adminAuth.getAdmin().getUserName();

        return new LoginResponseDTO(token, userName);
    }

    public void generateResetToken(String email) {

        AdminAuth adminAuth = adminAuthRepository
                .findByEmail(email)
                .orElse(null);

        if (adminAuth == null) {
            return;
        }

        SecureRandom secureRandom = new SecureRandom();

        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);

        String resetToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(tokenBytes);

        adminAuth.setResetToken(resetToken);
        adminAuth.setResetTokenExpiry(
                LocalDateTime.now().plusMinutes(15)
        );

        adminAuthRepository.save(adminAuth);

        String resetLink =
                "http://localhost:3000/reset-password?token="
                        + resetToken;

        emailService.sendPasswordResetEmail(
                adminAuth.getEmail(),
                resetLink
        );
    }

    public void resetForgotPassword(ResetPasswordRequestDTO request) {

        AdminAuth adminAuth = adminAuthRepository
                .findByResetToken(request.getToken())
                .orElseThrow(() ->
                        new RuntimeException("Invalid reset token"));

        if (adminAuth.getResetTokenExpiry() == null ||
                adminAuth.getResetTokenExpiry().isBefore(LocalDateTime.now())) {

            throw new RuntimeException("Reset token has expired");
        }

        adminAuth.setPasswordHash(
                passwordEncoder.encode(request.getNewPassword())
        );

        adminAuth.setResetToken(null);
        adminAuth.setResetTokenExpiry(null);

        adminAuthRepository.save(adminAuth);
    }

    public void changePassword(
            ChangePasswordRequestDTO request,
            Authentication authentication) {

        String email = authentication.getName();

        AdminAuth adminAuth = adminAuthRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                adminAuth.getPasswordHash())) {

            throw new RuntimeException("Current password is incorrect");
        }

        adminAuth.setPasswordHash(
                passwordEncoder.encode(request.getNewPassword())
        );

        adminAuthRepository.save(adminAuth);
    }
}