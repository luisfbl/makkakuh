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
import website.makkakuh.model.BadgeType;

@Path("/api/badge-types")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BadgeTypeResource {

    @Inject
    UserContext userContext;

    @GET
    @PermitAll
    public List<BadgeType> getAllBadgeTypes() {
        return BadgeType.listAll();
    }

    @GET
    @Path("/{id}")
    @PermitAll
    public Response getBadgeTypeById(@PathParam("id") Long id) {
        BadgeType badgeType = BadgeType.findById(id);
        if (badgeType == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(badgeType).build();
    }

    @POST
    @Transactional
    @RolesAllowed("ADMIN")
    public Response createBadgeType(Map<String, Object> data) {
        String name = (String) data.get("name");

        // Verifica se já existe um tipo com esse nome
        BadgeType existing = BadgeType.find("name", name).firstResult();
        if (existing != null) {
            return Response.status(Response.Status.CONFLICT)
                .entity(
                    Map.of("error", "Já existe um tipo de badge com este nome")
                )
                .build();
        }

        BadgeType badgeType = new BadgeType();
        badgeType.name = name;
        badgeType.description = (String) data.get("description");
        badgeType.isAvatarFrame = data.get("isAvatarFrame") != null
            ? (Boolean) data.get("isAvatarFrame")
            : false;
        badgeType.displayOrder = data.get("displayOrder") != null
            ? ((Number) data.get("displayOrder")).intValue()
            : 0;

        badgeType.persist();
        return Response.status(Response.Status.CREATED)
            .entity(badgeType)
            .build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    @RolesAllowed("ADMIN")
    public Response updateBadgeType(
        @PathParam("id") Long id,
        Map<String, Object> data
    ) {
        BadgeType badgeType = BadgeType.findById(id);
        if (badgeType == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (data.containsKey("name")) {
            String newName = (String) data.get("name");

            // Verifica se já existe outro tipo com esse nome
            BadgeType existing = BadgeType.find(
                "name = ?1 and id != ?2",
                newName,
                id
            ).firstResult();
            if (existing != null) {
                return Response.status(Response.Status.CONFLICT)
                    .entity(
                        Map.of(
                            "error",
                            "Já existe um tipo de badge com este nome"
                        )
                    )
                    .build();
            }

            badgeType.name = newName;
        }
        if (data.containsKey("description")) {
            badgeType.description = (String) data.get("description");
        }
        if (data.containsKey("isAvatarFrame")) {
            badgeType.isAvatarFrame = (Boolean) data.get("isAvatarFrame");
        }
        if (data.containsKey("displayOrder")) {
            badgeType.displayOrder = ((Number) data.get(
                    "displayOrder"
                )).intValue();
        }

        badgeType.persist();
        return Response.ok(badgeType).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed("ADMIN")
    public Response deleteBadgeType(@PathParam("id") Long id) {
        BadgeType badgeType = BadgeType.findById(id);
        if (badgeType == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        badgeType.delete();
        return Response.noContent().build();
    }
}
