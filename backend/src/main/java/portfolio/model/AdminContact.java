package portfolio.model;

import java.util.Objects;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
	
@Entity
@Table(name="admin_contact")
public class AdminContact {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
			
	@Column(name="email")
	private String email;
	
	@Column(name="phone")
	private String phone;
	
	@OneToOne
	@JoinColumn(name="admin_user")
	private Admin admin;
	
	public AdminContact() {
		
	}
	
	public AdminContact(Long id, String email, String phone, Admin admin) {
		this.id = id;
		this.email = email;
		this.phone = phone;
		this.admin = admin;
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
	
	public Admin getAdmin() {
		return admin;
	}
	public void setAdmin(Admin admin) {
		this.admin = admin;
	}
	
	@Override
	public boolean equals(Object o) {
		if(this == o) return true;
		if(!(o instanceof AdminContact)) return false;
		AdminContact contact = (AdminContact) o;
		return Objects.equals(id, contact.id);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
	
	@Override
	public String toString() {
		return "AdminContact [id=" + id +
				", email=" + email +
				", phone=" + phone + 
				", admin=" + admin + "]";
	}
}
