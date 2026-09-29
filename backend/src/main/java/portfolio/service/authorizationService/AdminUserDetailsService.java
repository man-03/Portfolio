package portfolio.service.authorizationService;

import portfolio.model.AdminAuth;
import portfolio.repository.AdminAuthRepository;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    private final AdminAuthRepository adminAuthRepository;

    public AdminUserDetailsService(AdminAuthRepository adminAuthRepository) {
        this.adminAuthRepository = adminAuthRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        AdminAuth adminAuth = adminAuthRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Admin not found"));

        return User.builder()
                .username(adminAuth.getEmail())
                .password(adminAuth.getPasswordHash())
                .roles(adminAuth.getRole())
                .build();
    }
}
