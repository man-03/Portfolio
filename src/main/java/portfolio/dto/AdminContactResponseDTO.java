package portfolio.dto;

public class AdminContactResponseDTO {

    private Long id;
    private String email;
    private String phone;
    private String adminUser;

    public AdminContactResponseDTO() {

    }

    public AdminContactResponseDTO(Long id, String email, String phone, String adminUser) {
        this.id = id;
        this.email = email;
        this.phone = phone;
        this.adminUser = adminUser;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getAdminUser() {
    	return adminUser;
    }
    
    public void setAdminUser(String adminUser) {
    	this.adminUser = adminUser;
    }

    @Override
    public String toString() {
        return "AdminContactResponseDTO [id=" + id +
                ", email=" + email +
                ", phone=" + phone +
                ", adminUser=" + adminUser + "]";
    }
}