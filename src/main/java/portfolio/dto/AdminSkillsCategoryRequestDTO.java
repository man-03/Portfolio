package portfolio.dto;

import java.util.List;

public class AdminSkillsCategoryRequestDTO {

    private Long id;
    private String category;
    private List<AdminSkillRequestDTO> skills;

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

    public List<AdminSkillRequestDTO> getSkills() {
        return skills;
    }

    public void setSkills(List<AdminSkillRequestDTO> skills) {
        this.skills = skills;
    }
}