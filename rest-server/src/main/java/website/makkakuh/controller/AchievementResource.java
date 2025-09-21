package website.makkakuh.controller;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import website.makkakuh.auth.UserContext;
import website.makkakuh.model.Achievement;
import website.makkakuh.model.User;
import website.makkakuh.model.UserAchievement;

@Path("/api/achievements")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AchievementResource {

    @Inject
    UserContext userContext;

    @GET
    public List<Achievement> getAllAchievements() {
        try {
            // Get all achievements
            return Achievement.listAll();
        } catch (Exception e) {
            throw new WebApplicationException(
                "Error fetching achievements",
                Response.Status.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GET
    @Path("/category/{category}")
    public List<Achievement> getAchievementsByCategory(
        @PathParam("category") String category
    ) {
        return Achievement.list(
            "category",
            Achievement.AchievementCategory.valueOf(category.toUpperCase())
        );
    }

    @POST
    @Transactional
    public Response createAchievement(Achievement achievement) {
        User currentUser = userContext.getCurrentUser();
        if (currentUser == null || !"ADMIN".equals(currentUser.role)) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        achievement.persist();
        return Response.status(Response.Status.CREATED)
            .entity(achievement)
            .build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateAchievement(
        @PathParam("id") Long id,
        Achievement achievement
    ) {
        User currentUser = userContext.getCurrentUser();
        if (currentUser == null || !"ADMIN".equals(currentUser.role)) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        Achievement existingAchievement = Achievement.findById(id);
        if (existingAchievement == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        existingAchievement.name = achievement.name;
        existingAchievement.description = achievement.description;
        existingAchievement.icon = achievement.icon;
        existingAchievement.iconFilename = achievement.iconFilename;
        existingAchievement.category = achievement.category;
        existingAchievement.order = achievement.order;
        existingAchievement.color = achievement.color;
        existingAchievement.isFrameForAvatar = achievement.isFrameForAvatar;

        return Response.ok(existingAchievement).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteAchievement(@PathParam("id") Long id) {
        User currentUser = userContext.getCurrentUser();
        if (currentUser == null || !"ADMIN".equals(currentUser.role)) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        Achievement achievement = Achievement.findById(id);
        if (achievement == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        achievement.delete();
        return Response.noContent().build();
    }

    @POST
    @Path("/{achievementId}/assign/{userId}")
    @Transactional
    public Response assignAchievementToUser(
        @PathParam("achievementId") Long achievementId,
        @PathParam("userId") Long userId
    ) {
        User currentUser = userContext.getCurrentUser();
        if (currentUser == null || !"ADMIN".equals(currentUser.role)) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        Achievement achievement = Achievement.findById(achievementId);
        User user = User.findById(userId);

        if (achievement == null || user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        // Check if user already has this achievement
        UserAchievement existing = UserAchievement.find(
            "user.id = ?1 and achievement.id = ?2",
            userId,
            achievementId
        ).firstResult();
        if (existing != null) {
            return Response.status(Response.Status.CONFLICT)
                .entity("User already has this achievement")
                .build();
        }

        UserAchievement userAchievement = new UserAchievement();
        userAchievement.user = user;
        userAchievement.achievement = achievement;
        userAchievement.persist();

        return Response.status(Response.Status.CREATED)
            .entity(userAchievement)
            .build();
    }

    @DELETE
    @Path("/{achievementId}/remove/{userId}")
    @Transactional
    public Response removeAchievementFromUser(
        @PathParam("achievementId") Long achievementId,
        @PathParam("userId") Long userId
    ) {
        User currentUser = userContext.getCurrentUser();
        if (currentUser == null || !"ADMIN".equals(currentUser.role)) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        UserAchievement userAchievement = UserAchievement.find(
            "user.id = ?1 and achievement.id = ?2",
            userId,
            achievementId
        ).firstResult();

        if (userAchievement == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        userAchievement.delete();
        return Response.noContent().build();
    }
}
