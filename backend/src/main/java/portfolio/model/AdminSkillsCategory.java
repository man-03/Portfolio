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
@Table(name="admin_skills_category")
public class AdminSkillsCategory {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)	
	private Long id;
	
	@Column(name="category")
	private String category;
	
	@ManyToOne
	@JoinColumn(name="admin_user")
	private Admin admin;
	
	public AdminSkillsCategory() {
		
	}
	
	public AdminSkillsCategory(Long id, String category, Admin admin) {
		this.id = id;
		this.category = category;
		this.admin = admin;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
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
		if(!(o instanceof AdminSkillsCategory)) return false;
		AdminSkillsCategory category = (AdminSkillsCategory) o;
		return Objects.equals(id, category.id);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
	
	@Override
	public String toString() {
		return "AdminSkillsCategory [id=" + id +
				", category=" + category +
				", admin=" + admin + "]";
	}
}
