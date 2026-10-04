package portfolio.dto;

import java.util.List;

public class GlobalResponseDTO {

    private AdminResponseDTO admin;
    private AdminContactResponseDTO contact;
    private List<AdminLinkResponseDTO> link;
    private List<AdminExperienceResponseDTO> experience;
    private List<AdminProjectResponseDTO> project;
    private List<AdminEducationResponseDTO> education;
    private List<LicenseAndCertificationResponseDTO> licenseAndCertification;
    private AdminSkillsAggregateResponseDTO skills;
    private List<AdminActivityResponseDTO> activity;
    private AdminResumeResponseDTO resume;

    public GlobalResponseDTO() {

    }

    public GlobalResponseDTO(
            AdminResponseDTO admin,
            AdminContactResponseDTO contact,
            List<AdminLinkResponseDTO> link,
            List<AdminExperienceResponseDTO> experience,
            List<AdminProjectResponseDTO> project,
            List<AdminEducationResponseDTO> education,
            List<LicenseAndCertificationResponseDTO> licenseAndCertification,
            AdminSkillsAggregateResponseDTO skills,
            List<AdminActivityResponseDTO> activity,
            AdminResumeResponseDTO resume) {

        this.admin = admin;
        this.contact = contact;
        this.link = link;
        this.experience = experience;
        this.project = project;
        this.education = education;
        this.licenseAndCertification = licenseAndCertification;
        this.skills = skills;
        this.activity = activity;
        this.resume = resume;
    }

    public AdminResponseDTO getAdmin() {
        return admin;
    }

    public void setAdmin(AdminResponseDTO admin) {
        this.admin = admin;
    }

    public AdminContactResponseDTO getContact() {
        return contact;
    }

    public void setContact(AdminContactResponseDTO contact) {
        this.contact = contact;
    }

    public List<AdminLinkResponseDTO> getLink() {
        return link;
    }

    public void setLink(List<AdminLinkResponseDTO> link) {
        this.link = link;
    }

    public List<AdminExperienceResponseDTO> getExperience() {
        return experience;
    }

    public void setExperience(List<AdminExperienceResponseDTO> experience) {
        this.experience = experience;
    }

    public List<AdminProjectResponseDTO> getProject() {
        return project;
    }

    public void setProject(List<AdminProjectResponseDTO> project) {
        this.project = project;
    }

    public List<AdminEducationResponseDTO> getEducation() {
        return education;
    }

    public void setEducation(List<AdminEducationResponseDTO> education) {
        this.education = education;
    }

    public List<LicenseAndCertificationResponseDTO> getLicenseAndCertification() {
        return licenseAndCertification;
    }

    public void setLicenseAndCertification(
            List<LicenseAndCertificationResponseDTO> licenseAndCertification) {
        this.licenseAndCertification = licenseAndCertification;
    }

    public AdminSkillsAggregateResponseDTO getSkills() {
        return skills;
    }

    public void setSkills(AdminSkillsAggregateResponseDTO skills) {
        this.skills = skills;
    }

    public List<AdminActivityResponseDTO> getActivity() {
        return activity;
    }

    public void setActivity(List<AdminActivityResponseDTO> activity) {
        this.activity = activity;
    }

    public AdminResumeResponseDTO getResume() {
        return resume;
    }

    public void setResume(AdminResumeResponseDTO resume) {
        this.resume = resume;
    }

    @Override
    public String toString() {
        return "GlobalResponseDTO{" +
                "admin=" + admin +
                ", contact=" + contact +
                ", link=" + link +
                ", experience=" + experience +
                ", project=" + project +
                ", education=" + education +
                ", licenseAndCertification=" + licenseAndCertification +
                ", skills=" + skills +
                ", activity=" + activity +
                '}';
    }
}