package website.makkakuh.model;

import java.time.Instant;

public class OAuthSession {
    private String state;
    private String codeVerifier;
    private String nonce;
    private String provider;
    private Instant createdAt;

    public OAuthSession() {
        this.createdAt = Instant.now();
    }

    public OAuthSession(String state, String codeVerifier, String nonce, String provider) {
        this.state = state;
        this.codeVerifier = codeVerifier;
        this.nonce = nonce;
        this.provider = provider;
        this.createdAt = Instant.now();
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCodeVerifier() {
        return codeVerifier;
    }

    public void setCodeVerifier(String codeVerifier) {
        this.codeVerifier = codeVerifier;
    }

    public String getNonce() {
        return nonce;
    }

    public void setNonce(String nonce) {
        this.nonce = nonce;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}