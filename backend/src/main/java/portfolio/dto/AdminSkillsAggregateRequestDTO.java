package portfolio.dto;

import java.util.List;

public class AdminSkillsAggregateRequestDTO {

    private List<AdminSkillsCategoryRequestDTO> categories;

    public List<AdminSkillsCategoryRequestDTO> getCategories() {
        return categories;
    }

    public void setCategories(List<AdminSkillsCategoryRequestDTO> categories) {
        this.categories = categories;
    }
}