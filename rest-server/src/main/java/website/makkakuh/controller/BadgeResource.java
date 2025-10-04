package website.makkakuh.controller;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import org.jboss.resteasy.reactive.MultipartForm;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;
import website.makkakuh.auth.UserContext;
import website.makkakuh.model.Badge;
import website.makkakuh.model.BadgeType;
import website.makkakuh.service.CDNService;

@Path("/api/badges")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BadgeResource {

    @Inject
    CDNService cdnService;

    @Inject
    UserContext userContext;

    @GET
    @PermitAll
    public List<Badge> getAllBadges() {
        return Badge.listAll();
    }

    @GET
    @Path("/by-type/{typeId}")
    @PermitAll
    public Response getBadgesByType(@PathParam("typeId") Long typeId) {
        List<Badge> badges = Badge.list("badgeType.id", typeId);
        return Response.ok(badges).build();
    }

    @GET
    @Path("/{id}")
    @PermitAll
    public Response getBadgeById(@PathParam("id") Long id) {
        Badge badge = Badge.findById(id);
        if (badge == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(badge).build();
    }

    @POST
    @Transactional
    @RolesAllowed("ADMIN")
    public Response createBadge(Map<String, Object> data) {
        Long badgeTypeId = ((Number) data.get("badgeTypeId")).longValue();
        BadgeType badgeType = BadgeType.findById(badgeTypeId);

        if (badgeType == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("error", "Badge type not found"))
                .build();
        }

        Badge badge = new Badge();
        badge.name = (String) data.get("name");
        badge.description = (String) data.get("description");
        badge.iconFilename = (String) data.get("iconFilename");
        badge.color = (String) data.get("color");
        badge.displayOrder = data.get("displayOrder") != null
            ? ((Number) data.get("displayOrder")).intValue()
            : 0;
        badge.badgeType = badgeType;

        badge.persist();
        return Response.status(Response.Status.CREATED).entity(badge).build();
    }

    @POST
    @Path("/{id}/upload-icon")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    @RolesAllowed("ADMIN")
    public Response uploadBadgeIcon(
        @PathParam("id") Long id,
        @MultipartForm BadgeIconUpload upload
    ) {
        Badge badge = Badge.findById(id);
        if (badge == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        try {
            String filename = cdnService.uploadFile(
                upload.file,
                "badges",
                badge.id.toString()
            );

            // Delete old icon if exists
            if (badge.iconFilename != null && !badge.iconFilename.isEmpty()) {
                try {
                    java.nio.file.Path oldPath = Paths.get(
                        cdnService.uploadDirectory,
                        "badges",
                        badge.iconFilename
                    );
                    Files.deleteIfExists(oldPath);
                } catch (Exception e) {
                    // Ignore deletion errors
                }
            }

            badge.iconFilename = filename;
            badge.persist();

            return Response.ok(
                Map.of(
                    "iconFilename",
                    filename,
                    "url",
                    "/api/cdn/images/badges/" + filename
                )
            ).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("error", e.getMessage()))
                .build();
        }
    }

    @PUT
    @Path("/{id}")
    @Transactional
    @RolesAllowed("ADMIN")
    public Response updateBadge(
        @PathParam("id") Long id,
        Map<String, Object> data
    ) {
        Badge badge = Badge.findById(id);
        if (badge == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (data.containsKey("name")) {
            badge.name = (String) data.get("name");
        }
        if (data.containsKey("description")) {
            badge.description = (String) data.get("description");
        }
        if (data.containsKey("color")) {
            badge.color = (String) data.get("color");
        }
        if (data.containsKey("displayOrder")) {
            badge.displayOrder = ((Number) data.get("displayOrder")).intValue();
        }
        if (data.containsKey("badgeTypeId")) {
            Long badgeTypeId = ((Number) data.get("badgeTypeId")).longValue();
            BadgeType badgeType = BadgeType.findById(badgeTypeId);
            if (badgeType != null) {
                badge.badgeType = badgeType;
            }
        }

        badge.persist();
        return Response.ok(badge).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed("ADMIN")
    public Response deleteBadge(@PathParam("id") Long id) {
        Badge badge = Badge.findById(id);
        if (badge == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        // Delete icon file if exists
        if (badge.iconFilename != null && !badge.iconFilename.isEmpty()) {
            try {
                java.nio.file.Path iconPath = Paths.get(
                    cdnService.uploadDirectory,
                    "badges",
                    badge.iconFilename
                );
                Files.deleteIfExists(iconPath);
            } catch (Exception e) {
                // Ignore deletion errors
            }
        }

        badge.delete();
        return Response.noContent().build();
    }

    public static class BadgeIconUpload {

        @RestForm("file")
        public FileUpload file;
    }
}
