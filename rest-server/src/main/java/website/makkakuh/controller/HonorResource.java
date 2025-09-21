package website.makkakuh.controller;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.multipart.FileUpload;
import website.makkakuh.auth.UserContext;
import website.makkakuh.model.Honor;
import website.makkakuh.model.User;
import website.makkakuh.service.CDNService;

@Path("/api/honors")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HonorResource {

    private static final Logger LOG = Logger.getLogger(HonorResource.class);

    @Inject
    CDNService cdnService;

    @Inject
    UserContext userContext;

    @GET
    public List<Map<String, Object>> getAllHonors() {
        try {
            return Honor.<Honor>listAll()
                .stream()
                .map(honor -> {
                    Map<String, Object> honorMap = new HashMap<>();
                    honorMap.put("id", honor.id);
                    honorMap.put("name", honor.name);
                    honorMap.put("icon", honor.icon);
                    honorMap.put("iconFilename", honor.iconFilename);
                    return honorMap;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            LOG.error("Error fetching honors", e);
            throw new WebApplicationException(
                "Error fetching honors",
                Response.Status.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GET
    @Path("/{id}")
    public Honor getHonorById(@PathParam("id") Long id) {
        Honor honor = Honor.findById(id);
        if (honor == null) {
            throw new WebApplicationException(
                "Honor not found",
                Response.Status.NOT_FOUND
            );
        }
        return honor;
    }

    @POST
    @Transactional
    public Response createHonor(Honor honor) {
        if (!isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN)
                .entity(Map.of("error", "Admin privileges required"))
                .build();
        }

        if (honor.name == null || honor.name.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("error", "Honor name is required"))
                .build();
        }

        honor.persist();
        return Response.status(Response.Status.CREATED).entity(honor).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateHonor(@PathParam("id") Long id, Honor updatedHonor) {
        if (!isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN)
                .entity(Map.of("error", "Admin privileges required"))
                .build();
        }

        Honor honor = Honor.findById(id);
        if (honor == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("error", "Honor not found"))
                .build();
        }

        honor.name = updatedHonor.name;

        if (updatedHonor.icon != null) {
            honor.icon = updatedHonor.icon;
        }

        if (updatedHonor.iconFilename != null) {
            honor.iconFilename = updatedHonor.iconFilename;
        }

        honor.persist();
        return Response.ok(honor).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteHonor(@PathParam("id") Long id) {
        if (!isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN)
                .entity(Map.of("error", "Admin privileges required"))
                .build();
        }

        Honor honor = Honor.findById(id);
        if (honor == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("error", "Honor not found"))
                .build();
        }

        if (honor.iconFilename != null && !honor.iconFilename.isEmpty()) {
            try {
                cdnService.deleteFile(honor.iconFilename, "honor");
            } catch (IOException e) {
                LOG.warn("Failed to delete honor icon file: " + e.getMessage());
            }
        }

        honor.delete();
        return Response.noContent().build();
    }

    @POST
    @Path("/{id}/icon")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Transactional
    public Response uploadHonorIcon(@PathParam("id") Long id, FileUpload file) {
        if (!isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN)
                .entity(Map.of("error", "Admin privileges required"))
                .build();
        }

        Honor honor = Honor.findById(id);
        if (honor == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("error", "Honor not found"))
                .build();
        }

        try {
            if (honor.iconFilename != null && !honor.iconFilename.isEmpty()) {
                try {
                    cdnService.deleteFile(honor.iconFilename, "honor");
                } catch (IOException e) {
                    LOG.warn(
                        "Failed to delete previous honor icon file: " +
                            e.getMessage()
                    );
                }
            }

            String filename = cdnService.uploadFile(
                file,
                "honor",
                String.valueOf(userContext.getCurrentUser().id)
            );

            honor.iconFilename = filename;
            honor.persist();

            return Response.ok(
                Map.of(
                    "success",
                    true,
                    "filename",
                    filename,
                    "url",
                    "/api/cdn/images/honor/" + filename,
                    "honor",
                    honor
                )
            ).build();
        } catch (WebApplicationException e) {
            LOG.error("Error uploading honor icon", e);
            return Response.status(e.getResponse().getStatus())
                .entity(Map.of("error", e.getMessage()))
                .build();
        } catch (Exception e) {
            LOG.error("Error uploading honor icon", e);
            return Response.serverError()
                .entity(
                    Map.of(
                        "error",
                        "Falha ao fazer upload do ícone: " + e.getMessage()
                    )
                )
                .build();
        }
    }

    /**
     * Check if current user is admin
     */
    private boolean isAdmin() {
        if (!userContext.isAuthenticated()) {
            return false;
        }

        User currentUser = userContext.getCurrentUser();
        return currentUser != null && "ADMIN".equals(currentUser.role);
    }
}
