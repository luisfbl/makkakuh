package website.makkakuh.service;

import io.vertx.core.http.Cookie;
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
import java.util.Map;

@ApplicationScoped
public class OAuthService {

    private static final Logger LOG = Logger.getLogger(OAuthService.class);
    private static final String SESSION_COOKIE_NAME = "makkakuh-session";
    private static final String OAUTH_SESSION_KEY = "oauth-session";
    private static final SecureRandom secureRandom = new SecureRandom();

    @Inject
    Instance<OAuthProviderService> providerServices;

    @ConfigProperty(name = "website.makkakuh.frontend.url", defaultValue = "http://localhost:4200")
    String frontendUrl;

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

    private void storeOAuthSessionInCookie(RoutingContext context, OAuthSession session) {
        String serialized = Base64.getUrlEncoder().encodeToString(
                (session.getProvider() + ":" + session.getState() + ":" +
                        session.getCodeVerifier() + ":" + session.getNonce()).getBytes(StandardCharsets.UTF_8));

        Cookie cookie = Cookie.cookie(OAUTH_SESSION_KEY, serialized)
                .setPath("/")
                .setHttpOnly(true)
                .setSecure(context.request().isSSL())
                .setMaxAge(600); // 10 minutes

        context.response().addCookie(cookie);
    }

    private OAuthSession retrieveOAuthSessionFromCookie(RoutingContext context) {
        Cookie cookie = context.request().getCookie(OAUTH_SESSION_KEY);
        if (cookie == null) {
            return null;
        }

        try {
            String value = cookie.getValue();
            String decoded = new String(Base64.getUrlDecoder().decode(value), StandardCharsets.UTF_8);
            String[] parts = decoded.split(":", 4);
            if (parts.length < 4) {
                return null;
            }

            return new OAuthSession(parts[1], parts[2], parts[3], parts[0]);
        } catch (Exception e) {
            LOG.error("Error retrieving OAuth session", e);
            return null;
        }
    }

    private void storeUserInSession(RoutingContext context, User user) {
        String userId = user.id.toString();
        Cookie cookie = Cookie.cookie(SESSION_COOKIE_NAME, userId)
                .setPath("/")
                .setHttpOnly(true)
                .setSecure(context.request().isSSL())
                .setMaxAge(86400); // 24 hours

        context.response().addCookie(cookie);
    }

    private User getUserFromSession(RoutingContext context) {
        Cookie cookie = context.request().getCookie(SESSION_COOKIE_NAME);
        if (cookie == null) {
            return null;
        }

        try {
            String userId = cookie.getValue();
            return User.findById(Long.parseLong(userId));
        } catch (Exception e) {
            LOG.error("Error retrieving user from session", e);
            return null;
        }
    }

    public static String encodeUrl(String url) throws UnsupportedEncodingException {
        return URLEncoder.encode(url, StandardCharsets.UTF_8.toString());
    }
}