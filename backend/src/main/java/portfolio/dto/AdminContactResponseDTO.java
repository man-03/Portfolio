package portfolio.dto;

public class AdminContactResponseDTO {

    private Long id;
    private String email;
    private String phone;

    public AdminContactResponseDTO() {

    }

    public AdminContactResponseDTO(Long id, String email, String phone) {
        this.id = id;
        this.email = email;
        this.phone = phone;
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

    @Override
    public String toString() {
        return "AdminContactResponseDTO [id=" + id +
                ", email=" + email +
                ", phone=" + phone + "]";
    }
}