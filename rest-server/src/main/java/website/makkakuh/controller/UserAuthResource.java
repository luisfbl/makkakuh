package website.makkakuh.controller;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import website.makkakuh.auth.UserContext;
import website.makkakuh.model.User;

import java.util.Map;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserAuthResource {

    private static final Logger LOG = Logger.getLogger(UserAuthResource.class);

    @Inject
    UserContext userContext;

    @GET
    @Path("/user")
    public Response getCurrentUser() {
        try {
            if (!userContext.isAuthenticated()) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity(Map.of("error", "Authentication required"))
                        .build();
            }

            User user = userContext.getCurrentUser();
            if (user == null) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity(Map.of("error", "User not found in session"))
                        .build();
            }

            return Response.ok(user).build();

        } catch (Exception e) {
            LOG.error("Error getting current user", e);
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("error", "Authentication failed"))
                    .build();
        }
    }
}