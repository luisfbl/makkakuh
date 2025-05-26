package website.makkakuh.auth;

import io.vertx.core.http.Cookie;
import io.vertx.ext.web.RoutingContext;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import website.makkakuh.model.User;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@RequestScoped
public class UserContext {

    private static final Logger LOG = Logger.getLogger(UserContext.class);
    private static final String SESSION_COOKIE_NAME = "makkakuh-session";
    private static final String HMAC_ALGORITHM = "HmacSHA256";

    @Inject
    RoutingContext routingContext;

    @ConfigProperty(name = "website.makkakuh.cookie.secret", defaultValue = "changeme_this_is_not_secure_enough_for_production")
    String cookieSecret;

    private User currentUser;

    public User getCurrentUser() {
        if (currentUser == null) {
            currentUser = getUserFromSession();
        }
        return currentUser;
    }
    
    public void setCurrentUser(User user) {
        this.currentUser = user;
    }

    public boolean isAuthenticated() {
        return getCurrentUser() != null;
    }

    private String computeHmac(String data) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(
                    cookieSecret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(keySpec);
            byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hmacBytes);
        } catch (Exception e) {
            LOG.error("Error computing HMAC", e);
            throw new RuntimeException("Failed to compute HMAC", e);
        }
    }

    private String extractSignedValue(String signedValue) {
        try {
            String[] parts = signedValue.split("\\|", 3);
            if (parts.length != 3) {
                LOG.warn("Invalid signed value format");
                return null;
            }

            String value = parts[0];
            long expiryTime = Long.parseLong(parts[1]);
            String signature = parts[2];

            if (System.currentTimeMillis() > expiryTime) {
                LOG.warn("Signed value has expired");
                return null;
            }

            String payload = value + "|" + expiryTime;
            String computedSignature = computeHmac(payload);

            if (!computedSignature.equals(signature)) {
                LOG.warn("Invalid signature for signed value");
                return null;
            }

            return value;
        } catch (Exception e) {
            LOG.error("Error extracting signed value", e);
            return null;
        }
    }

    private User getUserFromSession() {
        Cookie cookie = routingContext.request().getCookie(SESSION_COOKIE_NAME);
        if (cookie == null) {
            return null;
        }

        try {
            String signedValue = cookie.getValue();
            String extractedValue = extractSignedValue(signedValue);

            if (extractedValue == null) {
                Cookie invalidCookie = Cookie.cookie(SESSION_COOKIE_NAME, "invalid")
                        .setPath("/")
                        .setMaxAge(0);
                routingContext.response().addCookie(invalidCookie);
                return null;
            }

            String[] parts = extractedValue.split(":", 2);
            if (parts.length != 2) {
                LOG.warn("Malformed session data");
                return null;
            }

            String userId = parts[0];
            return User.findById(Long.parseLong(userId));
        } catch (Exception e) {
            LOG.error("Error retrieving user from session", e);
            return null;
        }
    }
}