package portfolio.model;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="admin_link")
public class AdminLink {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="platform")
	private String platform;
	
	@Column(name="url")
	private String url;
	
	@ManyToOne
	@JoinColumn(name="admin_user")
	private Admin admin;
	
	public AdminLink() {
		
	}
	
	public AdminLink(Long id, String platform, String url) {
		this.id = id;
		this.platform = platform;
		this.url = url;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getPlatform() {
		return platform;
	}
	public void setPlatform(String platform) {
		this.platform = platform;
	}
	
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
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
		if(!(o instanceof AdminLink)) return false;
		AdminLink links = (AdminLink) o;
		return Objects.equals(id, links.id);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
	
	@Override
	public String toString() {
		return "AdminAddress [id = " + id +
				", platform=" + platform +
				", url=" + url +
				", Admin=" + admin + "]";
	}
}
