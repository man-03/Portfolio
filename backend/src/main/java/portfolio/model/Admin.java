package portfolio.model;

import java.time.LocalDate;
import java.util.Objects;

import jakarta.persistence.*;

@Entity
@Table(name = "admin_profile")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "last_name")
	private String lastName;

	@Column(name = "date_of_birth")
	private LocalDate dateOfBirth;
	
	@Column(name = "pronoun")
	private String pronoun;

	@Column(name = "current_position")
	private String currentPosition;

	@Column(name = "my_quote")
	private String myQuote;

	@Column(name = "head_line")
	private String headLine;

	@Column(name = "about")
	private String about;
	
	@Column(name="profile_image_url")
	private String profileImageUrl;

    @OneToOne
    @JoinColumn(name = "admin_auth_id", nullable = false, unique = true)
    private AdminAuth adminAuth;
	
	public Admin() {
		
	}

	public Admin(Long id, String firstName, String lastName, LocalDate dateOfBirth, String pronoun,
            String currentPosition, String myQuote, String headLine, String about, String profileImageUrl, AdminAuth adminAuth) {

       this.id = id;
	   this.firstName = firstName;
	   this.lastName = lastName;
	   this.dateOfBirth = dateOfBirth;
	   this.pronoun = pronoun;
	   this.currentPosition = currentPosition;
	   this.myQuote = myQuote;
	   this.headLine = headLine;
	   this.about = about;
	   this.profileImageUrl = profileImageUrl;
       this.adminAuth = adminAuth;
	}

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPronoun() {
        return pronoun;
    }

    public void setPronoun(String pronoun) {
        this.pronoun = pronoun;
    }

    public String getCurrentPosition() {
        return currentPosition;
    }

    public void setCurrentPosition(String currentPosition) {
        this.currentPosition = currentPosition;
    }

    public String getMyQuote() {
        return myQuote;
    }

    public void setMyQuote(String myQuote) {
        this.myQuote = myQuote;
    }

    public String getHeadLine() {
        return headLine;
    }

    public void setHeadLine(String headLine) {
        this.headLine = headLine;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }
    
    public String getProfileImageUrl() {
    	return profileImageUrl;
    }
    
    public void setProfileImageUrl(String profileImageUrl) {
    	this.profileImageUrl = profileImageUrl;
    }

    public AdminAuth getAdminAuth() {
        return adminAuth;
    }

    public void setAdminAuth(AdminAuth adminAuth) {
        this.adminAuth = adminAuth;
    }

    // equals()

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;

        if (!(o instanceof Admin))
            return false;

        Admin admin = (Admin) o;

        return Objects.equals(id, admin.id);
    }

    // hashCode()

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // toString()

    @Override
    public String toString() {
        return "Admin [id=" + id +
                ", firstName=" + firstName +
                ", lastName=" + lastName +
                ", dateOfBirth=" + dateOfBirth +
                ", pronoun=" + pronoun +
                ", currentPosition=" + currentPosition +
                ", myQuote=" + myQuote +
                ", headLine=" + headLine +
                ", about=" + about +
                ", profileImageUrl=" + profileImageUrl +
                "]";
    }
}