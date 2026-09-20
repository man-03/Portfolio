package portfolio.dto;

public class AdminAddressRequestDTO {

	private String address;
	private String country;
	private String state;
	private String city;
	private String zip;
	
	public AdminAddressRequestDTO() {
		
	}
	
	public AdminAddressRequestDTO(String address, String country, String state, String city, String zip) {
		this.address = address;
		this.country = country;
		this.state = state;
		this.city = city;
		this.zip = zip;
	}
	
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	
	public String getZip() {
		return zip;
	}
	public void setZip(String zip) {
		this.zip = zip;
	}
	
	@Override
	public String toString() {
		return "AdminAddressRequestDTO [" + "address = " + address +
				", country = " + country + ", state = " + state + 
				", city = " + city + ", zip = " + zip + "]";
	}
}
