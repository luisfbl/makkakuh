package website.makkakuh.controller;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.jboss.logging.Logger;
import website.makkakuh.auth.UserContext;
import website.makkakuh.model.User;
import website.makkakuh.model.UserDetail;
import website.makkakuh.model.UserHonor;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    private static final Logger LOG = Logger.getLogger(UserResource.class);

    @Inject
    UserContext userContext;

    @GET
    @Path("/{id}")
    public User getUserById(@PathParam("id") Long id) {
        User user = User.findById(id);
        if (user == null) {
            throw new WebApplicationException(
                "User not found",
                Response.Status.NOT_FOUND
            );
        }
        return user;
    }

    @PUT
    @Path("/@me")
    @Transactional
    public Response updateUser(Map<String, Object> updates) {
        if (!userContext.isAuthenticated()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(Map.of("error", "Authentication required"))
                .build();
        }

        User contextUser = userContext.getCurrentUser();

        if (contextUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(Map.of("error", "User not found in session"))
                .build();
        }

        User user = User.findById(contextUser.id);

        LOG.info("Updating user " + user.id + " with updates: " + updates);
        LOG.info("Current avatarFilename: " + user.avatarFilename);

        if (updates.containsKey("name") && updates.get("name") != null) {
            user.name = (String) updates.get("name");
        }

        if (updates.containsKey("bio")) {
            user.bio = (String) updates.get("bio");
        }

        if (updates.containsKey("nickname")) {
            user.nickname = (String) updates.get("nickname");
        }

        if (
            updates.containsKey("avatarFilename") &&
            updates.get("avatarFilename") != null
        ) {
            String newAvatarFilename = (String) updates.get("avatarFilename");
            LOG.info(
                "Updating avatarFilename from " +
                    user.avatarFilename +
                    " to " +
                    newAvatarFilename
            );
            user.avatarFilename = newAvatarFilename;
        }

        user.persist();
        LOG.info("User persisted with avatarFilename: " + user.avatarFilename);
        return Response.ok(user).build();
    }

    @GET
    @Path("/{id}/profile")
    public Response getUserProfile(@PathParam("id") Long id) {
        User user = User.findById(id);
        if (user == null) {
            throw new WebApplicationException(
                "User not found",
                Response.Status.NOT_FOUND
            );
        }

        List<UserDetail> userDetails = UserDetail.list("user", user);
        UserDetail userDetail = userDetails.isEmpty()
            ? null
            : userDetails.get(0);

        List<UserHonor> userHonors = UserHonor.list("user", user);

        Map<String, Object> profile = new HashMap<>();
        profile.put("user", user);
        profile.put("userDetail", userDetail);
        profile.put("honors", userHonors);

        return Response.ok(profile).build();
    }
}
