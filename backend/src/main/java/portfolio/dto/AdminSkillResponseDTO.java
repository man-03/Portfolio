package portfolio.dto;

public class AdminSkillResponseDTO {

    private Long id;
    private String skill;
    private Long categoryId;

    public AdminSkillResponseDTO() {

    }

    public AdminSkillResponseDTO(Long id, String skill, Long categoryId) {
        this.id = id;
        this.skill = skill;
        this.categoryId = categoryId;
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

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    @Override
    public String toString() {
        return "AdminSkillResponseDTO [id=" + id +
                ", skill=" + skill +
                ", categoryId=" + categoryId + "]";
    }
}