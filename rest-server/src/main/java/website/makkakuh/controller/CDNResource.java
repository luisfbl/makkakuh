package website.makkakuh.controller;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;
import website.makkakuh.auth.UserContext;
import website.makkakuh.service.CDNService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Date;
import java.util.Map;

@Path("/api/cdn")
public class CDNResource {

    private static final Logger LOG = Logger.getLogger(CDNResource.class);

    @Inject
    CDNService cdnService;
    
    @Inject
    UserContext userContext;
    
    void onStart(@Observes StartupEvent ev) {
        cdnService.init();
    }

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadFile(
            @RestForm("file") FileUpload file,
            @RestForm("type") String type) {
        
        try {
            if (userContext.getCurrentUser() == null) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity(Map.of("error", "Usuário não autenticado"))
                        .build();
            }
            
            String filename = cdnService.uploadFile(file, type, String.valueOf(userContext.getCurrentUser().id));
            
            return Response.ok(Map.of(
                    "success", true,
                    "filename", filename,
                    "url", "/api/cdn/images/" + type + "/" + filename
            )).build();
            
        } catch (WebApplicationException e) {
            LOG.error("Error uploading file", e);
            return Response.status(e.getResponse().getStatus())
                    .entity(Map.of("error", e.getMessage()))
                    .build();
        } catch (Exception e) {
            LOG.error("Error uploading file", e);
            return Response.serverError()
                    .entity(Map.of("error", "Falha ao fazer upload do arquivo: " + e.getMessage()))
                    .build();
        }
    }

    @GET
    @Path("/images/{type}/{filename}")
    public Response getImage(
            @PathParam("type") String type,
            @PathParam("filename") String filename,
            @QueryParam("size") Integer size,
            @Context Request request) {
        
        try {
            java.nio.file.Path path;
            if (size != null && "avatar".equalsIgnoreCase(type)) {
                path = cdnService.getFilePath(size + "_" + filename, type);
            } else {
                path = cdnService.getFilePath(filename, type);
            }
            return serveFile(path, request);

        } catch (WebApplicationException e) {
            if (e.getResponse().getStatus() == Response.Status.NOT_FOUND.getStatusCode()) {
                try {
                    java.nio.file.Path defaultImage = cdnService.getFilePath("default_" + type + ".png", type);
                    return serveFile(defaultImage, request);
                } catch (WebApplicationException ex) {
                    return Response.status(Response.Status.NOT_FOUND)
                            .entity("Imagem não encontrada")
                            .build();
                }
            }
            
            return Response.status(e.getResponse().getStatus())
                    .entity(e.getMessage())
                    .build();
        }
    }

    private Response serveFile(java.nio.file.Path filePath, Request request) {
        try {
            File file = filePath.toFile();

            String lastModified = new Date(file.lastModified()).toString();
            String etag = "\"" + lastModified + "-" + file.length() + "\"";

            Response.ResponseBuilder builder = request.evaluatePreconditions(
                    new Date(file.lastModified()), EntityTag.valueOf(etag));
            
            if (builder != null) {
                return builder.build();
            }

            String mimeType = Files.probeContentType(filePath);
            if (mimeType == null) {
                mimeType = "application/octet-stream";
            }

            builder = Response.ok(file);
            builder.type(mimeType);
            builder.lastModified(new Date(file.lastModified()));
            builder.tag(etag);

            builder.header("Cache-Control", "public, max-age=86400");
            
            return builder.build();
            
        } catch (IOException e) {
            LOG.error("Error serving file", e);
            return Response.serverError()
                    .entity("Erro ao servir arquivo: " + e.getMessage())
                    .build();
        }
    }

    @DELETE
    @Path("/images/{type}/{filename}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteImage(
            @PathParam("type") String type,
            @PathParam("filename") String filename) {
        
        try {
            if (userContext.getCurrentUser() == null) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity(Map.of("error", "Usuário não autenticado"))
                        .build();
            }
            
            cdnService.deleteFile(filename, type);
            
            return Response.ok(Map.of(
                    "success", true,
                    "message", "Arquivo excluído com sucesso"
            )).build();
            
        } catch (WebApplicationException e) {
            return Response.status(e.getResponse().getStatus())
                    .entity(Map.of("error", e.getMessage()))
                    .build();
        } catch (Exception e) {
            LOG.error("Error deleting file", e);
            return Response.serverError()
                    .entity(Map.of("error", "Falha ao excluir o arquivo: " + e.getMessage()))
                    .build();
        }
    }
}