package website.makkakuh.model;

public class UserProfile {
    private String id;
    private String name;
    private String email;
    private String pictureUrl;
    private String locale;
    private String provider;

    public UserProfile() {
    }

    public UserProfile(String id, String name, String email, String pictureUrl, String locale, String provider) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.pictureUrl = pictureUrl;
        this.locale = locale;
        this.provider = provider;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    // Create User from UserProfile
    public User toUser() {
        User user = new User();
        user.name = this.name;
        user.email = this.email;
        user.oauthId = this.id;
        user.oauthMethod = this.provider;
        user.pictureUrl = this.pictureUrl;
        user.locale = this.locale;
        return user;
    }
}