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
@Table(name="license_and_certification")
public class LicenseAndCertification {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="name")
	private String name;
	
	@Column(name="issuing_organisation")
	private String issuingOrganisation;
	
	@Column(name="start_month")
	private Short startMonth;
	
	@Column(name="start_year")
	private Short startYear;
	
	@Column(name="end_month")
	private Short endMonth;
	
	@Column(name="end_year")
	private Short endYear;
	
	@Column(name="credential_id")
	private String credentialId;
	
	@Column(name="credential_url")
	private String credentialUrl;
	
	@Column(name="landc_url")
	private String landcUrl;
	
	@Column(name="org_logo_url")
	private String orgLogoUrl;
	
	@ManyToOne
    @JoinColumn(name="admin_user")
    private Admin admin;
	
	public LicenseAndCertification() {
		
	}
	
	public LicenseAndCertification(Long id, String name, String issuingOrganisation, Short startMonth,
			Short startYear, Short endMonth, Short endYear, String credentialId, String credentialUrl,
			String landcUrl, String orgLogoUrl, Admin admin) {
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
		this.admin = admin;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id=id;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name=name;
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
	
	public Admin getAdmin() {
    	return admin;
    }
    public void setAdmin(Admin admin) {
    	this.admin = admin;
    }
	
	@Override
	public boolean equals(Object o) {
		if(this == o) return true;
		if(!(o instanceof LicenseAndCertification)) return false;
		LicenseAndCertification licenseAndCertificate = (LicenseAndCertification) o;
		return Objects.equals(id, licenseAndCertificate.id);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
	
	@Override
	public String toString() {
		return "LicenseAndCertification [id=" + id + ", name=" + name +
				", issuingOrganisation=" + issuingOrganisation +
				", startMonth=" + startMonth + ", startYear" + startYear +
				", endMonth=" + endMonth + ",endYear" + endYear +
				", credentialId=" + credentialId +
				", credentialUrl=" + credentialUrl +
				", landcUrl=" + landcUrl +
				", orgLogoUrl" + orgLogoUrl +
				", Admin=" + admin +"]";
	}
}
