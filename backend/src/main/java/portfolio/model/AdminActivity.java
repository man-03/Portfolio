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
@Table(name="admin_activity")
public class AdminActivity {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="activity_description")
	private String activityDescription;
	
	@Column(name="activity_media_url")
	private String activityMediaUrl;
	
	@ManyToOne
	@JoinColumn(name="admin_user")
	private Admin admin;
	
	public AdminActivity() {
		
	}
	
	public AdminActivity(Long id, String activityDescription, String activityMediaUrl, Admin admin) {
			this.id = id;
			this.activityDescription = activityDescription;
			this.activityMediaUrl = activityMediaUrl;
			this.admin = admin;
		}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getActivityDescription() {
		return activityDescription;
	}
	public void setActivityDescription(String activityDescription) {
		this.activityDescription = activityDescription;
	}
	
	public String getActivityMediaUrl() {
		return activityDescription;
	}
	public void setActivityMediaUrl(String activityMediaUrl) {
		this.activityMediaUrl = activityMediaUrl;
	}
	
	public Admin getAdmin() {
		return admin;
	}
	public void setAmdin(Admin admin) {
		this.admin = admin;
	}
	
	@Override
	public boolean equals(Object o) {
		if(this == o) return true;
		if(!(o instanceof AdminActivity)) return false;
		AdminActivity activity = (AdminActivity) o;
		return Objects.equals(id, activity.id);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
	
	@Override
	public String toString() {
		return "AdminActivity [id=" + id +
				", activityDescription=" + activityDescription +
				", activityMediaUrl" + activityMediaUrl +
				", admin=" + admin + "]";
	}
}
