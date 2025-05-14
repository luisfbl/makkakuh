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
import org.jboss.logging.Logger;
import website.makkakuh.model.User;

import java.io.IOException;

@Provider
@ApplicationScoped
@Priority(Priorities.AUTHENTICATION)
public class SecurityFilter implements ContainerRequestFilter {

    private static final Logger LOG = Logger.getLogger(SecurityFilter.class);
    private static final String SESSION_COOKIE_NAME = "makkakuh-session";

    @Context
    ResourceInfo resourceInfo;

    @Inject
    RoutingContext routingContext;

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
        }
    }

    private boolean isPublicPath(String path) {
        return path.startsWith("/auth/") ||
                path.equals("/api/health") ||
                path.equals("/api/users");
    }

    private User getUserFromSession() {
        Cookie cookie = routingContext.request().getCookie(SESSION_COOKIE_NAME);
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
}