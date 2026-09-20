package portfolio.dto;

public class AdminContactRequestDTO {

    private String email;
    private String phone;

    public AdminContactRequestDTO() {

    }

    public AdminContactRequestDTO(String email, String phone) {
        this.email = email;
        this.phone = phone;
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
        return "AdminContactRequestDTO [email=" + email +
                ", phone=" + phone + "]";
    }
}