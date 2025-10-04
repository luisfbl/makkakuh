package website.makkakuh.security;

import io.quarkus.security.identity.AuthenticationRequestContext;
import io.quarkus.security.identity.IdentityProvider;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.runtime.QuarkusSecurityIdentity;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;
import website.makkakuh.auth.UserContext;
import website.makkakuh.model.User;
import website.makkakuh.util.SessionSigningUtil;

@ApplicationScoped
public class CookieIdentityProvider
    implements IdentityProvider<CookieAuthRequest> {

    private static final Logger LOG = Logger.getLogger(
        CookieIdentityProvider.class
    );

    @Inject
    UserContext userContext;

    @Override
    public Class<CookieAuthRequest> getRequestType() {
        return CookieAuthRequest.class;
    }

    @Override
    public Uni<SecurityIdentity> authenticate(
        CookieAuthRequest request,
        AuthenticationRequestContext context
    ) {
        return context.runBlocking(() -> {
            try {
                String signedValue = request.getCookieValue();
                String extractedValue = SessionSigningUtil.extractSignedValue(
                    signedValue,
                    request.getSecret()
                );

                if (extractedValue == null) {
                    return null;
                }

                String[] parts = extractedValue.split(":", 2);
                if (parts.length != 2) {
                    LOG.warn("Malformed session data");
                    return null;
                }

                String userId = parts[0];
                User user = User.findById(Long.parseLong(userId));

                if (user == null) {
                    LOG.warn("User not found for ID: " + userId);
                    return null;
                }

                // Set user in context for backward compatibility
                userContext.setCurrentUser(user);

                LOG.info(
                    "Authenticated user: " +
                        user.email +
                        " with role: " +
                        user.role
                );

                return QuarkusSecurityIdentity.builder()
                    .setPrincipal(() -> user.email)
                    .addRole(user.role)
                    .addAttribute("user", user)
                    .build();
            } catch (Exception e) {
                LOG.error("Error authenticating user from cookie", e);
                return null;
            }
        });
    }
}
