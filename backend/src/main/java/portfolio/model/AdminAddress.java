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
@Table(name="admin_address")
public class AdminAddress {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name="address")
	private String address;
	@Column(name="country")
	private String country;
	@Column(name="state")
	private String state;
	@Column(name="city")
	private String city;
	@Column(name="zip")
	private String zip;
	@OneToOne
	@JoinColumn(name="admin_user")
	private Admin admin;
	
	public AdminAddress() {
		
	}
	
	public AdminAddress(String address, String country, String state, String city, String zip, Admin admin) {
		this.address = address;
		this.country = country;
		this.state = state;
		this.city = city;
		this.zip = zip;
		this.admin = admin;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	
	public String getZip() {
		return zip;
	}
	public void setZip(String zip) {
		this.zip = zip;
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
		if(!(o instanceof AdminAddress)) return false;
		AdminAddress address = (AdminAddress) o;
		return Objects.equals(id, address.id);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
	
	@Override
	public String toString() {
		return "AdminAddress [id = " + id + ", address = " + address +
				", country = " + country + ", state = " + state + 
				", city = " + city + ", zip = " + zip + ", Admin=" + admin + "]";
	}
}
