package portfolio.dto;

import java.time.LocalDate;

public class AdminRequestDTO {

    private String userName;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String pronoun;
    private String currentPosition;
    private String myQuote;
    private String headLine;
    private String about;
    private String profileImageUrl;
    private String password;
    private AdminAddressRequestDTO adminAddressRequestDTO;

    public AdminRequestDTO() {

    }

    public AdminRequestDTO(String userName, String firstName, String lastName, LocalDate dateOfBirth, String pronoun,
                    String currentPosition, String myQuote, String headLine, String about, String profileImageUrl, String password, AdminAddressRequestDTO adminAddressRequestDTO) {

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
        this.adminAddressRequestDTO = adminAddressRequestDTO;
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
    
    public AdminAddressRequestDTO getAdminAddressRequestDTO() {
        return adminAddressRequestDTO;
    }

    public void setAdminAddress(AdminAddressRequestDTO adminAddressRequestDTO) {
        this.adminAddressRequestDTO = adminAddressRequestDTO;
    }

    @Override
    public String toString() {
        return "AdminDTO [userName = " + userName +
                ", firstName = " + firstName +
                ", lastName = " + lastName +
                ", dateOfBirth = " + dateOfBirth +
                ", pronoun = " + pronoun +
                ", currentPosition = " + currentPosition +
                ", myQuote = " + myQuote +
                ", headLine = " + headLine +
                ", about = " + about +
                ", profileImageUrl = " + profileImageUrl +
                "]";
    }
}