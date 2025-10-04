package website.makkakuh.security;

import io.quarkus.security.identity.IdentityProviderManager;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.identity.request.AuthenticationRequest;
import io.quarkus.vertx.http.runtime.security.ChallengeData;
import io.quarkus.vertx.http.runtime.security.HttpAuthenticationMechanism;
import io.quarkus.vertx.http.runtime.security.HttpCredentialTransport;
import io.smallrye.mutiny.Uni;
import io.vertx.ext.web.RoutingContext;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Collections;
import java.util.Set;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class CookieAuthenticationMechanism
    implements HttpAuthenticationMechanism {

    private static final String SESSION_COOKIE_NAME = "makkakuh-session";

    @ConfigProperty(
        name = "website.makkakuh.cookie.secret",
        defaultValue = "changeme_this_is_not_secure_enough_for_production"
    )
    String cookieSecret;

    @Override
    public Uni<SecurityIdentity> authenticate(
        RoutingContext context,
        IdentityProviderManager identityProviderManager
    ) {
        io.vertx.core.http.Cookie cookie = context
            .request()
            .getCookie(SESSION_COOKIE_NAME);

        if (cookie == null) {
            return Uni.createFrom().nullItem();
        }

        CookieAuthRequest authRequest = new CookieAuthRequest(
            cookie.getValue(),
            cookieSecret
        );
        return identityProviderManager.authenticate(authRequest);
    }

    @Override
    public Uni<ChallengeData> getChallenge(RoutingContext context) {
        return Uni.createFrom().item(new ChallengeData(401, null, null));
    }

    @Override
    public Set<Class<? extends AuthenticationRequest>> getCredentialTypes() {
        return Collections.singleton(CookieAuthRequest.class);
    }

    @Override
    public Uni<HttpCredentialTransport> getCredentialTransport(
        RoutingContext context
    ) {
        return Uni.createFrom().item(
            new HttpCredentialTransport(
                HttpCredentialTransport.Type.COOKIE,
                SESSION_COOKIE_NAME
            )
        );
    }
}
