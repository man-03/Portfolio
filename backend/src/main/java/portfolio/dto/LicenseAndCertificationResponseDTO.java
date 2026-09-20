package portfolio.dto;

public class LicenseAndCertificationResponseDTO {
	
    private Long id;
    private String name;
    private String issuingOrganisation;
    private Short startMonth;
    private Short startYear;
    private Short endMonth;
    private Short endYear;
    private String credentialId;
    private String credentialUrl;
    private String landcUrl;
    private String orgLogoUrl;
    private String adminUser;

    public LicenseAndCertificationResponseDTO() {

    }

    public LicenseAndCertificationResponseDTO(Long id, String name,
            String issuingOrganisation,
            Short startMonth, Short startYear,
            Short endMonth, Short endYear,
            String credentialId, String credentialUrl,
            String landcUrl, String orgLogoUrl,
            String adminUser) {

        this.id = id;
        this.name = name;
        this.issuingOrganisation = issuingOrganisation;
        this.startMonth = startMonth;
        this.startYear = startYear;
        this.endMonth = endMonth;
        this.endYear = endYear;
        this.credentialId = credentialId;
        this.credentialUrl = credentialUrl;
        this.landcUrl = landcUrl;
        this.orgLogoUrl = orgLogoUrl;
        this.adminUser = adminUser;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIssuingOrganisation() {
        return issuingOrganisation;
    }

    public void setIssuingOrganisation(String issuingOrganisation) {
        this.issuingOrganisation = issuingOrganisation;
    }

    public Short getStartMonth() {
        return startMonth;
    }

    public void setStartMonth(Short startMonth) {
        this.startMonth = startMonth;
    }

    public Short getStartYear() {
        return startYear;
    }

    public void setStartYear(Short startYear) {
        this.startYear = startYear;
    }

    public Short getEndMonth() {
        return endMonth;
    }

    public void setEndMonth(Short endMonth) {
        this.endMonth = endMonth;
    }

    public Short getEndYear() {
        return endYear;
    }

    public void setEndYear(Short endYear) {
        this.endYear = endYear;
    }

    public String getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(String credentialId) {
        this.credentialId = credentialId;
    }

    public String getCredentialUrl() {
        return credentialUrl;
    }

    public void setCredentialUrl(String credentialUrl) {
        this.credentialUrl = credentialUrl;
    }

    public String getLandcUrl() {
        return landcUrl;
    }

    public void setLandcUrl(String landcUrl) {
        this.landcUrl = landcUrl;
    }

    public String getOrgLogoUrl() {
        return orgLogoUrl;
    }

    public void setOrgLogoUrl(String orgLogoUrl) {
        this.orgLogoUrl = orgLogoUrl;
    }
    
    public String getAdminUser() {
    	return adminUser;
    }
    public void setAdminUser(String adminUser) {
    	this.adminUser = adminUser;
    }
    

    @Override
    public String toString() {
        return "LicenseAndCertificationResponseDTO [id=" + id +
                ", name=" + name +
                ", issuingOrganisation=" + issuingOrganisation +
                ", startMonth=" + startMonth +
                ", startYear=" + startYear +
                ", endMonth=" + endMonth +
                ", endYear=" + endYear +
                ", credentialId=" + credentialId +
                ", credentialUrl=" + credentialUrl +
                ", landcUrl=" + landcUrl +
                ", orgLogoUrl=" + orgLogoUrl +
                ", adminUser=" + adminUser + "]";
    }
}