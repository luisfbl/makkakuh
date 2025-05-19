package website.makkakuh.auth;

import io.vertx.core.http.Cookie;
import io.vertx.core.http.CookieSameSite;
import io.vertx.ext.web.RoutingContext;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ResourceInfo;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import website.makkakuh.model.User;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Provider
@ApplicationScoped
@Priority(Priorities.AUTHENTICATION - 10) // Execute before authentication
public class CSRFFilter implements ContainerRequestFilter {

    private static final Logger LOG = Logger.getLogger(CSRFFilter.class);
    private static final String CSRF_COOKIE_NAME = "makkakuh-csrf-token";
    private static final String CSRF_HEADER_NAME = "X-CSRF-Token";
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final String HMAC_ALGORITHM = "HmacSHA256";

    @Inject
    RoutingContext routingContext;

    @ConfigProperty(name = "website.makkakuh.cookie.secret", defaultValue = "changeme_this_is_not_secure_enough_for_production")
    String cookieSecret;

    @Context
    ResourceInfo resourceInfo;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String method = requestContext.getMethod();

        if (method.equals("GET") || method.equals("HEAD") || method.equals("OPTIONS")) {
            ensureCSRFToken();
            return;
        }

        String path = requestContext.getUriInfo().getPath();
        if (isPublicPath(path)) {
            return;
        }

        validateCSRFToken(requestContext);
    }

    private boolean isPublicPath(String path) {
        return path.startsWith("/auth/") ||
                path.equals("/api/health") ||
                path.equals("/api/users");
    }

    private void validateCSRFToken(ContainerRequestContext requestContext) {
        Cookie csrfCookie = routingContext.request().getCookie(CSRF_COOKIE_NAME);
        if (csrfCookie == null) {
            abortWithCSRFError(requestContext, "Missing CSRF cookie");
            return;
        }

        MultivaluedMap<String, String> headers = requestContext.getHeaders();
        List<String> csrfHeaders = headers.get(CSRF_HEADER_NAME);

        if (csrfHeaders == null || csrfHeaders.isEmpty()) {
            abortWithCSRFError(requestContext, "Missing CSRF header");
            return;
        }

        String headerToken = csrfHeaders.get(0);
        String cookieToken = csrfCookie.getValue();

        if (!headerToken.equals(cookieToken)) {
            abortWithCSRFError(requestContext, "CSRF token mismatch");
        }
    }

    private void abortWithCSRFError(ContainerRequestContext requestContext, String message) {
        LOG.warn("CSRF validation failed: " + message);
        requestContext.abortWith(
                Response.status(Response.Status.FORBIDDEN)
                        .entity("CSRF validation failed")
                        .build());
    }

    private void ensureCSRFToken() {
        Cookie existingCookie = routingContext.request().getCookie(CSRF_COOKIE_NAME);
        if (existingCookie == null) {
            byte[] tokenBytes = new byte[32];
            secureRandom.nextBytes(tokenBytes);
            String token = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);

            Cookie cookie = Cookie.cookie(CSRF_COOKIE_NAME, token)
                    .setPath("/")
                    .setHttpOnly(false)
                    .setSecure(true)
                    .setSameSite(CookieSameSite.LAX)
                    .setMaxAge(3600); // 1 hour

            routingContext.response().putHeader(CSRF_HEADER_NAME, token);
            routingContext.response().addCookie(cookie);
        } else {
            routingContext.response().putHeader(CSRF_HEADER_NAME, existingCookie.getValue());
        }
    }
}