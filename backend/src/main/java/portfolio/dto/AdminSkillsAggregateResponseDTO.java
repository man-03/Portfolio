package portfolio.dto;

import java.util.List;

public class AdminSkillsAggregateResponseDTO {

    private List<AdminSkillsCategoryResponseDTO> categories;

    public List<AdminSkillsCategoryResponseDTO> getCategories() {
        return categories;
    }

    public void setCategories(List<AdminSkillsCategoryResponseDTO> categories) {
        this.categories = categories;
    }
}
