package portfolio.service.authorizationService;

import portfolio.dto.LoginRequestDTO;
import portfolio.dto.LoginResponseDTO;
import portfolio.model.AdminAuth;
import portfolio.repository.AdminAuthRepository;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AdminAuthRepository adminAuthRepository;
    private final JwtService jwtService;

    public AuthService(
            AuthenticationManager authenticationManager,
            AdminAuthRepository adminAuthRepository,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.adminAuthRepository = adminAuthRepository;
        this.jwtService = jwtService;
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
}