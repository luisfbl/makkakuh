package website.makkakuh.auth;

import io.vertx.core.http.Cookie;
import io.vertx.ext.web.RoutingContext;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ResourceInfo;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import website.makkakuh.model.User;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Provider
@ApplicationScoped
@Priority(Priorities.AUTHENTICATION)
public class SecurityFilter implements ContainerRequestFilter {

    private static final Logger LOG = Logger.getLogger(SecurityFilter.class);
    private static final String SESSION_COOKIE_NAME = "makkakuh-session";
    private static final String HMAC_ALGORITHM = "HmacSHA256";

    @Context
    ResourceInfo resourceInfo;

    @Inject
    RoutingContext routingContext;

    @ConfigProperty(name = "website.makkakuh.cookie.secret", defaultValue = "changeme_this_is_not_secure_enough_for_production")
    String cookieSecret;

    @Inject
    UserContext userContext;
    
    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String path = requestContext.getUriInfo().getPath();
        if (isPublicPath(path)) {
            return;
        }

        User user = getUserFromSession();
        if (user == null) {
            requestContext.abortWith(
                    Response.status(Response.Status.UNAUTHORIZED)
                            .entity("Authentication required")
                            .build());
            return;
        }

        userContext.setCurrentUser(user);
    }

    private boolean isPublicPath(String path) {
        if (path.startsWith("/api/auth/") || path.equals("/api/health")) {
            return true;
        }

        return routingContext.request().method().name().equals("GET") && (
                path.startsWith("/api/mural") ||
                        path.startsWith("/api/users") ||
                        path.startsWith("/api/cdn") ||
                        path.startsWith("/api/events")
        );
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