package website.makkakuh.controller;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import website.makkakuh.model.User;

import java.util.List;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @GET
    public List<User> getAllUsers() {
        return User.listAll();
    }
}