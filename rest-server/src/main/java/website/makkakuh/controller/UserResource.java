package website.makkakuh.controller;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.jboss.logging.Logger;
import website.makkakuh.auth.UserContext;
import website.makkakuh.dto.UserWithBadgesDTO;
import website.makkakuh.model.User;
import website.makkakuh.model.UserDetail;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    private static final Logger LOG = Logger.getLogger(UserResource.class);

    @Inject
    UserContext userContext;

    @GET
    @PermitAll
    public Response getAllUsers(@QueryParam("search") String search) {
        List<User> users;

        if (search == null || search.trim().isEmpty()) {
            users = User.listAll();
        } else {
            String searchTerm = "%" + search.toLowerCase() + "%";
            users = User.list(
                "LOWER(name) LIKE ?1 OR LOWER(nickname) LIKE ?1 OR LOWER(email) LIKE ?1",
                searchTerm
            );
        }

        // Carregar badges para cada usuário e converter para DTO
        List<UserWithBadgesDTO> usersWithBadges = users
            .stream()
            .map(user -> {
                if (user.badges != null) {
                    user.badges.size(); // Force lazy loading
                }
                return UserWithBadgesDTO.fromUser(user);
            })
            .collect(Collectors.toList());

        return Response.ok(usersWithBadges).build();
    }

    @GET
    @Path("/{id}")
    @PermitAll
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
    @RolesAllowed({ "USER", "ADMIN" })
    public Response updateUser(Map<String, Object> updates) {
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
    @PermitAll
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

        Map<String, Object> profile = new HashMap<>();
        profile.put("user", user);
        profile.put("userDetail", userDetail);

        return Response.ok(profile).build();
    }

    @PUT
    @Path("/{id}/role")
    @Transactional
    @RolesAllowed("ADMIN")
    public Response updateUserRole(
        @PathParam("id") Long id,
        Map<String, String> data
    ) {
        User currentUser = userContext.getCurrentUser();
        if (currentUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(Map.of("error", "User not found in session"))
                .build();
        }

        User user = User.findById(id);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("error", "User not found"))
                .build();
        }

        String newRole = data.get("role");
        if (
            newRole == null ||
            (!newRole.equals("ADMIN") && !newRole.equals("USER"))
        ) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("error", "Invalid role. Must be ADMIN or USER"))
                .build();
        }

        LOG.info(
            "Admin " +
                currentUser.name +
                " is changing role of user " +
                user.name +
                " from " +
                user.role +
                " to " +
                newRole
        );

        user.role = newRole;
        user.persist();

        return Response.ok(user).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed("ADMIN")
    public Response deleteUser(@PathParam("id") Long id) {
        User currentUser = userContext.getCurrentUser();
        if (currentUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(Map.of("error", "User not found in session"))
                .build();
        }

        User user = User.findById(id);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("error", "User not found"))
                .build();
        }

        // Não permitir que o admin delete a si mesmo
        if (user.id.equals(currentUser.id)) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("error", "Cannot delete your own account"))
                .build();
        }

        LOG.info(
            "Admin " +
                currentUser.name +
                " is deleting user " +
                user.name +
                " (ID: " +
                user.id +
                ")"
        );

        // Deletar o usuário (cascade irá deletar badges e subscriptions automaticamente)
        user.delete();

        return Response.ok(
            Map.of("message", "User deleted successfully", "userId", id)
        ).build();
    }
}
