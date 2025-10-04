package website.makkakuh.security;

import io.quarkus.security.identity.request.BaseAuthenticationRequest;

public class CookieAuthRequest extends BaseAuthenticationRequest {

    private final String cookieValue;
    private final String secret;

    public CookieAuthRequest(String cookieValue, String secret) {
        this.cookieValue = cookieValue;
        this.secret = secret;
    }

    public String getCookieValue() {
        return cookieValue;
    }

    public String getSecret() {
        return secret;
    }
}
