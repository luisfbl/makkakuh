package website.makkakuh.service;

import io.vertx.core.http.Cookie;
import io.vertx.core.http.CookieSameSite;
import io.vertx.ext.web.RoutingContext;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Instance;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import website.makkakuh.model.OAuthPKCE;
import website.makkakuh.model.OAuthSession;
import website.makkakuh.model.User;
import website.makkakuh.model.UserProfile;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@ApplicationScoped
public class OAuthService {

    private static final Logger LOG = Logger.getLogger(OAuthService.class);
    private static final String SESSION_COOKIE_NAME = "makkakuh-session";
    private static final String OAUTH_SESSION_KEY = "oauth-session";
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final long SESSION_EXPIRY_SECONDS = 3600; // 1 hour instead of 24 hours
    private static final long OAUTH_SESSION_EXPIRY_SECONDS = 600; // 10 minutes, unchanged

    @Inject
    Instance<OAuthProviderService> providerServices;

    @ConfigProperty(name = "website.makkakuh.frontend.url", defaultValue = "http://localhost:4200")
    String frontendUrl;
    
    @ConfigProperty(name = "website.makkakuh.cookie.secret", defaultValue = "changeme_this_is_not_secure_enough_for_production")
    String cookieSecret;

    public Response getAuthorizationUrl(RoutingContext context, String provider) {
        OAuthProviderService providerService = getProviderService(provider);
        if (providerService == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Unsupported OAuth provider: " + provider))
                    .build();
        }

        try {
            OAuthPKCE pkce = new OAuthPKCE();

            String state = generateSecureRandomString();
            String nonce = generateSecureRandomString();

            OAuthSession session = new OAuthSession(state, pkce.getCodeVerifier(), nonce, provider);
            storeOAuthSessionInCookie(context, session);

            String redirectUri = buildRedirectUri(provider);
            String authUrl = providerService.getAuthorizationUrl(redirectUri, state, pkce.getCodeChallenge());

            return Response.ok(Map.of("url", authUrl)).build();
        } catch (Exception e) {
            LOG.error("Error generating authorization URL", e);
            return Response.serverError()
                    .entity(Map.of("error", "Failed to generate authorization URL"))
                    .build();
        }
    }

    @Transactional
    public Response handleCallback(RoutingContext context, String provider, String code, String state) {
        OAuthProviderService providerService = getProviderService(provider);
        if (providerService == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Unsupported OAuth provider: " + provider))
                    .build();
        }

        OAuthSession session = retrieveOAuthSessionFromCookie(context);
        if (session == null || !session.getProvider().equals(provider) || !session.getState().equals(state)) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Invalid OAuth state"))
                    .build();
        }

        try {
            String redirectUri = buildRedirectUri(provider);
            UserProfile userProfile = providerService.processTokenResponse(code, redirectUri, session.getCodeVerifier())
                    .await().indefinitely();

            User user = User.findByOauthId(userProfile.getId(), provider);

            if (user == null) {
                user = User.findByEmail(userProfile.getEmail());

                if (user == null) {
                    return Response.ok(Map.of(
                            "isNewUser", true,
                            "userProfile", userProfile
                    )).build();
                } else {
                    user.oauthId = userProfile.getId();
                    user.oauthMethod = provider;
                    if (user.pictureUrl == null) {
                        user.pictureUrl = userProfile.getPictureUrl();
                    }
                    user.persist();
                }
            }

            storeUserInSession(context, user);

            return Response.ok(Map.of(
                    "isNewUser", false,
                    "user", user
            )).build();

        } catch (Exception e) {
            LOG.error("Error processing OAuth callback", e);
            return Response.serverError()
                    .entity(Map.of("error", "Failed to process authentication"))
                    .build();
        }
    }

    @Transactional
    public Response completeSignIn(UserProfile userProfile) {
        try {
            User existingUser = User.findByEmail(userProfile.getEmail());

            if (existingUser != null) {
                return Response.status(Response.Status.CONFLICT)
                        .entity(Map.of("error", "User with this email already exists"))
                        .build();
            }

            User newUser = userProfile.toUser();
            newUser.type = "USER";
            newUser.persist();

            return Response.ok(Map.of("user", newUser)).build();
        } catch (Exception e) {
            LOG.error("Error completing sign-in", e);
            return Response.serverError()
                    .entity(Map.of("error", "Failed to complete sign-in"))
                    .build();
        }
    }

    public Response signOut(RoutingContext context) {
        context.removeCookie(SESSION_COOKIE_NAME);
        return Response.ok(Map.of("message", "Successfully signed out")).build();
    }

    public Response getCurrentUser(RoutingContext context) {
        User user = getUserFromSession(context);
        if (user != null) {
            return Response.ok(user).build();
        } else {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }

    private OAuthProviderService getProviderService(String provider) {
        for (OAuthProviderService service : providerServices) {
            if (service.getProviderName().equalsIgnoreCase(provider)) {
                return service;
            }
        }
        return null;
    }

    private String buildRedirectUri(String provider) {
        return frontendUrl + "/auth/" + provider + "/callback";
    }

    private String generateSecureRandomString() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
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

    private String createSignedValue(String value, long expirySeconds) {
        long expiryTime = System.currentTimeMillis() + (expirySeconds * 1000);
        String payload = value + "|" + expiryTime;
        String signature = computeHmac(payload);
        return payload + "|" + signature;
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
            
            // Check if expired
            if (System.currentTimeMillis() > expiryTime) {
                LOG.warn("Signed value has expired");
                return null;
            }
            
            // Verify signature
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

    private void storeOAuthSessionInCookie(RoutingContext context, OAuthSession session) {
        try {
            // Serialize session data
            String sessionData = session.getProvider() + ":" + 
                session.getState() + ":" +
                session.getCodeVerifier() + ":" + 
                session.getNonce();
                
            // Encode and sign the session data
            String serialized = Base64.getUrlEncoder().encodeToString(
                    sessionData.getBytes(StandardCharsets.UTF_8));
            String signedValue = createSignedValue(serialized, OAUTH_SESSION_EXPIRY_SECONDS);
            
            // Create secure cookie
            Cookie cookie = Cookie.cookie(OAUTH_SESSION_KEY, signedValue)
                    .setPath("/")
                    .setHttpOnly(true)
                    .setSecure(true) // Always set secure for auth cookies
                    .setSameSite(CookieSameSite.LAX) // Prevent CSRF
                    .setMaxAge(OAUTH_SESSION_EXPIRY_SECONDS);
    
            context.response().addCookie(cookie);
        } catch (Exception e) {
            LOG.error("Error storing OAuth session in cookie", e);
            throw new RuntimeException("Failed to store OAuth session", e);
        }
    }

    private OAuthSession retrieveOAuthSessionFromCookie(RoutingContext context) {
        Cookie cookie = context.request().getCookie(OAUTH_SESSION_KEY);
        if (cookie == null) {
            return null;
        }

        try {
            String signedValue = cookie.getValue();
            String extractedValue = extractSignedValue(signedValue);
            
            if (extractedValue == null) {
                return null;
            }
            
            String decoded = new String(Base64.getUrlDecoder().decode(extractedValue), StandardCharsets.UTF_8);
            String[] parts = decoded.split(":", 4);
            if (parts.length < 4) {
                LOG.warn("Invalid OAuth session format");
                return null;
            }

            // Immediately invalidate this cookie after using it once (single-use token)
            Cookie invalidatedCookie = Cookie.cookie(OAUTH_SESSION_KEY, "invalid")
                    .setPath("/")
                    .setHttpOnly(true)
                    .setSecure(true)
                    .setSameSite(CookieSameSite.LAX)
                    .setMaxAge(0); // Expire immediately
                    
            context.response().addCookie(invalidatedCookie);

            return new OAuthSession(parts[1], parts[2], parts[3], parts[0]);
        } catch (Exception e) {
            LOG.error("Error retrieving OAuth session", e);
            return null;
        }
    }

    private void storeUserInSession(RoutingContext context, User user) {
        // Generate a session token instead of just using the user ID
        String sessionToken = generateSecureRandomString();
        
        // Create a signed session token with user ID
        String sessionData = user.id + ":" + sessionToken;
        String signedValue = createSignedValue(sessionData, SESSION_EXPIRY_SECONDS);
        
        Cookie cookie = Cookie.cookie(SESSION_COOKIE_NAME, signedValue)
                .setPath("/")
                .setHttpOnly(true)
                .setSecure(true) // Always set secure for auth cookies
                .setSameSite(CookieSameSite.LAX) // Prevent CSRF
                .setMaxAge(SESSION_EXPIRY_SECONDS); // Reduced from 24 hours to 1 hour

        context.response().addCookie(cookie);
    }

    private User getUserFromSession(RoutingContext context) {
        Cookie cookie = context.request().getCookie(SESSION_COOKIE_NAME);
        if (cookie == null) {
            return null;
        }

        try {
            String signedValue = cookie.getValue();
            String extractedValue = extractSignedValue(signedValue);
            
            if (extractedValue == null) {
                LOG.warn("Invalid or expired session");
                // Remove invalid cookie
                Cookie invalidCookie = Cookie.cookie(SESSION_COOKIE_NAME, "invalid")
                    .setPath("/")
                    .setMaxAge(0);
                context.response().addCookie(invalidCookie);
                return null;
            }
            
            // Session value format is "userId:sessionToken"
            String[] parts = extractedValue.split(":", 2);
            if (parts.length != 2) {
                LOG.warn("Malformed session data");
                return null;
            }
            
            String userId = parts[0];
            // The sessionToken (parts[1]) could be stored in a database for additional validation
            // or revocation capabilities, but we're using the signed cookie approach for now
            
            User user = User.findById(Long.parseLong(userId));
            
            // Auto-extend the session if it's valid and about to expire
            if (user != null) {
                // Extract expiry time from the cookie value
                String[] valueParts = signedValue.split("\\|", 3);
                if (valueParts.length == 3) {
                    long expiryTime = Long.parseLong(valueParts[1]);
                    long halfExpiryThreshold = SESSION_EXPIRY_SECONDS * 1000 / 2;
                    
                    // If more than half the time has passed, refresh the session
                    if (System.currentTimeMillis() > (expiryTime - halfExpiryThreshold)) {
                        storeUserInSession(context, user);
                    }
                }
            }
            
            return user;
        } catch (Exception e) {
            LOG.error("Error retrieving user from session", e);
            return null;
        }
    }

    public static String encodeUrl(String url) throws UnsupportedEncodingException {
        return URLEncoder.encode(url, StandardCharsets.UTF_8.toString());
    }
}