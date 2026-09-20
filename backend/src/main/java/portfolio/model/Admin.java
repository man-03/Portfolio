package portfolio.model;

import java.time.LocalDate;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin_profile")
public class Admin {

	@Id //This field uniquely identifies a row in the database table.
	@Column(name = "user_name")
	private String userName;

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
	
	@Column(name = "password")
	private String password;
	
	public Admin() {
		
	}

	public Admin(String userName, String firstName, String lastName, LocalDate dateOfBirth, String pronoun,
            String currentPosition, String myQuote, String headLine, String about, String profileImageUrl, String password) {

	   this.userName = userName;
	   this.firstName = firstName;
	   this.lastName = lastName;
	   this.dateOfBirth = dateOfBirth;
	   this.pronoun = pronoun;
	   this.currentPosition = currentPosition;
	   this.myQuote = myQuote;
	   this.headLine = headLine;
	   this.about = about;
	   this.profileImageUrl = profileImageUrl;
	   this.password = password;
	}
	
	public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // equals()

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;

        if (!(o instanceof Admin))
            return false;

        Admin admin = (Admin) o;

        return Objects.equals(userName, admin.userName);
    }

    // hashCode()

    @Override
    public int hashCode() {
        return Objects.hash(userName);
    }

    // toString()

    @Override
    public String toString() {
        return "Admin [userName=" + userName +
                ", firstName=" + firstName +
                ", lastName=" + lastName +
                ", dateOfBirth=" + dateOfBirth +
                ", pronoun=" + pronoun +
                ", currentPosition=" + currentPosition +
                ", myQuote=" + myQuote +
                ", headLine=" + headLine +
                ", about=" + about +
                ", profileImageUrl" + profileImageUrl +
                "]";
    }
}