package portfolio.dto;

import java.util.List;

public class AdminSkillsCategoryResponseDTO {

    private Long id;
    private String category;
    private List<AdminSkillResponseDTO> skills;
    private String adminUser;

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

    public List<AdminSkillResponseDTO> getSkills() {
        return skills;
    }

    public void setSkills(List<AdminSkillResponseDTO> skills) {
        this.skills = skills;
    }
    
    public String getAdminUser() {
        return adminUser;
    }

    public void setAdminUser(String adminUser) {
        this.adminUser = adminUser;
    }
}