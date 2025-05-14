package website.makkakuh.auth;

import io.vertx.core.http.Cookie;
import io.vertx.ext.web.RoutingContext;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;
import website.makkakuh.model.User;

@RequestScoped
public class UserContext {

    private static final Logger LOG = Logger.getLogger(UserContext.class);
    private static final String SESSION_COOKIE_NAME = "makkakuh-session";

    @Inject
    RoutingContext routingContext;

    private User currentUser;

    public User getCurrentUser() {
        if (currentUser == null) {
            currentUser = getUserFromSession();
        }
        return currentUser;
    }

    public boolean isAuthenticated() {
        return getCurrentUser() != null;
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