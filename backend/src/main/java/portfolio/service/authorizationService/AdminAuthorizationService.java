package portfolio.service.authorizationService;

import portfolio.model.AdminAuth;
import portfolio.repository.AdminAuthRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthorizationService {

    private final AdminAuthRepository adminAuthRepository;

    public AdminAuthorizationService(
            AdminAuthRepository adminAuthRepository) {
        this.adminAuthRepository = adminAuthRepository;
    }

    public boolean isAuthorized(
            Authentication authentication,
            String userName) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return false;
        }

        String email = authentication.getName();

        AdminAuth adminAuth = adminAuthRepository
                .findByEmail(email)
                .orElse(null);

        if (adminAuth == null ||
                adminAuth.getAdmin() == null) {
            return false;
        }

        return adminAuth.getAdmin()
                .getUserName()
                .equals(userName);
    }

    public boolean isCurrentAdmin(
            Authentication authentication,
            String userName) {

        return isAuthorized(authentication, userName);
    }
}