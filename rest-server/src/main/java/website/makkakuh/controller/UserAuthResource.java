package website.makkakuh.controller;

import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;
import org.jboss.logging.Logger;
import website.makkakuh.auth.UserContext;
import website.makkakuh.model.User;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@PermitAll
public class UserAuthResource {

    private static final Logger LOG = Logger.getLogger(UserAuthResource.class);

    @Inject
    UserContext userContext;

    @GET
    @Path("/user")
    public Response getCurrentUser() {
        try {
            if (!userContext.isAuthenticated()) {
                return Response.ok(Map.of("authenticated", false)).build();
            }

            User user = userContext.getCurrentUser();
            if (user == null) {
                return Response.ok(Map.of("authenticated", false)).build();
            }

            return Response.ok(user).build();
        } catch (Exception e) {
            LOG.error("Error getting current user", e);
            return Response.ok(Map.of("authenticated", false)).build();
        }
    }
}
