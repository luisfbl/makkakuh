package website.makkakuh.model;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public class OAuthPKCE {
    private static final SecureRandom secureRandom = new SecureRandom();
    
    private String codeVerifier;
    private String codeChallenge;
    
    public OAuthPKCE() {
        this.codeVerifier = generateCodeVerifier();
        try {
            this.codeChallenge = generateCodeChallenge(codeVerifier);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to create PKCE challenge", e);
        }
    }
    
    public String getCodeVerifier() {
        return codeVerifier;
    }
    
    public String getCodeChallenge() {
        return codeChallenge;
    }

    private static String generateCodeVerifier() {
        byte[] bytes = new byte[64]; // 64 bytes = 512 bits
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String generateCodeChallenge(String codeVerifier) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(codeVerifier.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
    }
}