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
@Table(name="admin_skill")
public class AdminSkill {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="skill")
	private String skill;
	
	@ManyToOne
	@JoinColumn(name="skill_category_id")
	private AdminSkillsCategory adminSkillsCategory;
	
	public AdminSkill() {
		
	}
	
	public AdminSkill(Long id, String skill, AdminSkillsCategory adminSkillsCategory) {
		this.id = id;
		this.skill = skill;
		this.adminSkillsCategory = adminSkillsCategory;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getSkill() {
		return skill;
	}
	public void setSkill(String skill) {
		this.skill = skill;
	}
	
	public AdminSkillsCategory getAdminSkillsCategory() {
		return adminSkillsCategory;
	}
	public void setAdminSkillsCategory(AdminSkillsCategory adminSkillsCategory) {
		this.adminSkillsCategory = adminSkillsCategory;
	}
	
	@Override
	public boolean equals(Object o) {
		if(this == o) return true;
		if(!(o instanceof AdminSkill)) return false;
		AdminSkill skill = (AdminSkill) o;
		return Objects.equals(id, skill.id);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
	
	@Override
	public String toString() {
		return "AdminSkill [id=" + id +
				", skill=" + skill +
				", adminSkillsCategory=" + adminSkillsCategory + "]";
	}
}
