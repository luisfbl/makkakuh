package website.makkakuh.controller;

import io.vertx.ext.web.RoutingContext;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import website.makkakuh.model.UserProfile;
import website.makkakuh.service.OAuthService;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@PermitAll
public class AuthResource {

    private static final Logger LOG = Logger.getLogger(AuthResource.class);

    @Inject
    OAuthService oAuthService;

    @GET
    @Path("/oauth/{provider}")
    public Response getOAuthUrl(
        @Context RoutingContext context,
        @PathParam("provider") String provider
    ) {
        LOG.info("Starting OAuth flow for provider: " + provider);
        return oAuthService.getAuthorizationUrl(context, provider);
    }

    @GET
    @Path("/{provider}/callback")
    public Response handleCallback(
        @Context RoutingContext context,
        @PathParam("provider") String provider,
        @QueryParam("code") String code,
        @QueryParam("state") String state
    ) {
        LOG.info("Handling OAuth callback for provider: " + provider);
        return oAuthService.handleCallback(context, provider, code, state);
    }

    @POST
    @Path("/sign-in")
    public Response completeSignIn(
        @Context RoutingContext context,
        UserProfile userProfile
    ) {
        LOG.info("Completing sign-in for user: " + userProfile.getEmail());
        return oAuthService.completeSignIn(context, userProfile);
    }

    @POST
    @Path("/sign-out")
    public Response signOut(@Context RoutingContext context) {
        LOG.info("User signing out");
        return oAuthService.signOut(context);
    }
}
