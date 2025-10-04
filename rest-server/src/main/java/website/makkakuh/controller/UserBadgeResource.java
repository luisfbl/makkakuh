package website.makkakuh.controller;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Map;
import website.makkakuh.auth.UserContext;
import website.makkakuh.model.Badge;
import website.makkakuh.model.User;
import website.makkakuh.model.UserBadge;

@Path("/api/user-badges")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserBadgeResource {

    @Inject
    UserContext userContext;

    @GET
    @Path("/user/{userId}")
    @PermitAll
    public Response getUserBadges(@PathParam("userId") Long userId) {
        List<UserBadge> userBadges = UserBadge.list("user.id", userId);
        return Response.ok(userBadges).build();
    }

    @GET
    @Path("/me")
    @RolesAllowed({ "USER", "ADMIN" })
    public Response getMyBadges() {
        User user = userContext.getCurrentUser();
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        List<UserBadge> userBadges = UserBadge.list("user.id", user.id);
        return Response.ok(userBadges).build();
    }

    @POST
    @Transactional
    @RolesAllowed("ADMIN")
    public Response awardBadge(Map<String, Object> data) {
        Long userId = ((Number) data.get("userId")).longValue();
        Long badgeId = ((Number) data.get("badgeId")).longValue();

        User user = User.findById(userId);
        Badge badge = Badge.findById(badgeId);

        if (user == null || badge == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("error", "User or Badge not found"))
                .build();
        }

        // Check if already awarded
        long count = UserBadge.count(
            "user.id = ?1 and badge.id = ?2",
            userId,
            badgeId
        );
        if (count > 0) {
            return Response.status(Response.Status.CONFLICT)
                .entity(Map.of("error", "Badge already awarded to this user"))
                .build();
        }

        UserBadge userBadge = new UserBadge();
        userBadge.user = user;
        userBadge.badge = badge;
        userBadge.notes = (String) data.get("notes");

        userBadge.persist();
        return Response.status(Response.Status.CREATED)
            .entity(userBadge)
            .build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed("ADMIN")
    public Response revokeBadge(@PathParam("id") Long id) {
        UserBadge userBadge = UserBadge.findById(id);
        if (userBadge == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        userBadge.delete();
        return Response.noContent().build();
    }

    @GET
    @Path("/all")
    @PermitAll
    public Response getAllUserBadges() {
        List<UserBadge> userBadges = UserBadge.listAll();
        return Response.ok(userBadges).build();
    }
}
