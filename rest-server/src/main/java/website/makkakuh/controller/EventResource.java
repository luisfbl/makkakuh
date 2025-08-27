package website.makkakuh.controller;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import website.makkakuh.auth.UserContext;
import website.makkakuh.model.Event;
import website.makkakuh.model.EventRequest;
import website.makkakuh.model.Subscription;
import website.makkakuh.model.User;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/api/events")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EventResource {

    private static final Logger LOG = Logger.getLogger(EventResource.class);

    @Inject
    UserContext userContext;

    /**
     * Get all events (accessible to all authenticated users)
     */
    @GET
    public Response getAllEvents() {
        if (!userContext.isAuthenticated()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("error", "Authentication required"))
                    .build();
        }

        try {
            List<Event> events = Event.findAllOrdered();
            LOG.info("Retrieved " + events.size() + " events");
            return Response.ok(events).build();
        } catch (Exception e) {
            LOG.error("Error retrieving events", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", "Failed to retrieve events"))
                    .build();
        }
    }

    /**
     * Get event by ID (accessible to all authenticated users)
     */
    @GET
    @Path("/{id}")
    public Response getEventById(@PathParam("id") Long id) {
        if (!userContext.isAuthenticated()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("error", "Authentication required"))
                    .build();
        }

        Event event = Event.findById(id);
        if (event == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", "Event not found"))
                    .build();
        }

        return Response.ok(event).build();
    }

    /**
     * Create a new event (admin only)
     */
    @POST
    @Transactional
    public Response createEvent(@Valid EventRequest eventRequest) {
        if (!isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("error", "Admin privileges required"))
                    .build();
        }

        try {
            Event event = eventRequest.toEntity();
            event.persist();
            
            LOG.info("Event created with ID: " + event.id + " by user: " + userContext.getCurrentUser().id);
            return Response.status(Response.Status.CREATED).entity(event).build();
        } catch (Exception e) {
            LOG.error("Error creating event", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", "Failed to create event"))
                    .build();
        }
    }

    /**
     * Update an event (admin only)
     */
    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateEvent(@PathParam("id") Long id, @Valid EventRequest eventRequest) {
        if (!isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("error", "Admin privileges required"))
                    .build();
        }

        Event event = Event.findById(id);
        if (event == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", "Event not found"))
                    .build();
        }

        try {
            // Update fields
            event.title = eventRequest.title;
            event.description = eventRequest.description;
            event.date = eventRequest.date;
            event.place = eventRequest.place;
            event.maxParticipants = eventRequest.maxParticipants;
            event.recurrence = eventRequest.recurrence;

            event.persist();
            
            LOG.info("Event updated with ID: " + event.id + " by user: " + userContext.getCurrentUser().id);
            return Response.ok(event).build();
        } catch (Exception e) {
            LOG.error("Error updating event", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", "Failed to update event"))
                    .build();
        }
    }

    /**
     * Delete an event (admin only)
     */
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteEvent(@PathParam("id") Long id) {
        if (!isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("error", "Admin privileges required"))
                    .build();
        }

        Event event = Event.findById(id);
        if (event == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", "Event not found"))
                    .build();
        }

        try {
            event.delete();
            LOG.info("Event deleted with ID: " + id + " by user: " + userContext.getCurrentUser().id);
            return Response.noContent().build();
        } catch (Exception e) {
            LOG.error("Error deleting event", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", "Failed to delete event"))
                    .build();
        }
    }

    /**
     * Get upcoming events (accessible to all authenticated users)
     */
    @GET
    @Path("/upcoming")
    public Response getUpcomingEvents() {
        if (!userContext.isAuthenticated()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("error", "Authentication required"))
                    .build();
        }

        try {
            List<Event> events = Event.findUpcoming();
            return Response.ok(events).build();
        } catch (Exception e) {
            LOG.error("Error retrieving upcoming events", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", "Failed to retrieve upcoming events"))
                    .build();
        }
    }

    /**
     * Get events by date range (accessible to all authenticated users)
     */
    @GET
    @Path("/date-range")
    public Response getEventsByDateRange(
            @QueryParam("startDate") String startDateStr,
            @QueryParam("endDate") String endDateStr) {
        
        if (!userContext.isAuthenticated()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("error", "Authentication required"))
                    .build();
        }

        try {
            LocalDate startDate = LocalDate.parse(startDateStr);
            LocalDate endDate = LocalDate.parse(endDateStr);
            
            List<Event> events = Event.findByDateRange(startDate, endDate);
            return Response.ok(events).build();
        } catch (Exception e) {
            LOG.error("Error retrieving events by date range", e);
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Invalid date format. Use YYYY-MM-DD"))
                    .build();
        }
    }

    /**
     * Subscribe to an event (authenticated users only)
     */
    @POST
    @Path("/{id}/subscribe")
    @Transactional
    public Response subscribeToEvent(@PathParam("id") Long eventId) {
        if (!userContext.isAuthenticated()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("error", "Authentication required"))
                    .build();
        }

        Event event = Event.findById(eventId);
        if (event == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", "Event not found"))
                    .build();
        }

        User currentUser = userContext.getCurrentUser();
        
        // Check if user is already subscribed
        if (Subscription.isUserSubscribed(currentUser, event)) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(Map.of("error", "Already subscribed to this event"))
                    .build();
        }

        // Check if event is full
        if (event.maxParticipants != null) {
            long currentSubscriptions = Subscription.countByEvent(event);
            if (currentSubscriptions >= event.maxParticipants) {
                return Response.status(Response.Status.CONFLICT)
                        .entity(Map.of("error", "Event is full"))
                        .build();
            }
        }

        try {
            Subscription subscription = new Subscription();
            subscription.user = currentUser;
            subscription.event = event;
            subscription.persist();

            LOG.info("User " + currentUser.id + " subscribed to event " + eventId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully subscribed to event");
            response.put("subscriptionId", subscription.id);
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (Exception e) {
            LOG.error("Error subscribing to event", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", "Failed to subscribe to event"))
                    .build();
        }
    }

    /**
     * Unsubscribe from an event (authenticated users only)
     */
    @DELETE
    @Path("/{id}/subscribe")
    @Transactional
    public Response unsubscribeFromEvent(@PathParam("id") Long eventId) {
        if (!userContext.isAuthenticated()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("error", "Authentication required"))
                    .build();
        }

        Event event = Event.findById(eventId);
        if (event == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", "Event not found"))
                    .build();
        }

        User currentUser = userContext.getCurrentUser();
        Subscription subscription = Subscription.findByUserAndEvent(currentUser, event);
        
        if (subscription == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", "Not subscribed to this event"))
                    .build();
        }

        try {
            subscription.delete();
            LOG.info("User " + currentUser.id + " unsubscribed from event " + eventId);
            return Response.ok(Map.of("message", "Successfully unsubscribed from event")).build();
        } catch (Exception e) {
            LOG.error("Error unsubscribing from event", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", "Failed to unsubscribe from event"))
                    .build();
        }
    }

    /**
     * Get current user's subscription status for an event
     */
    @GET
    @Path("/{id}/subscription-status")
    public Response getSubscriptionStatus(@PathParam("id") Long eventId) {
        if (!userContext.isAuthenticated()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("error", "Authentication required"))
                    .build();
        }

        Event event = Event.findById(eventId);
        if (event == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", "Event not found"))
                    .build();
        }

        User currentUser = userContext.getCurrentUser();
        boolean isSubscribed = Subscription.isUserSubscribed(currentUser, event);
        long totalSubscriptions = Subscription.countByEvent(event);
        
        Map<String, Object> response = new HashMap<>();
        response.put("isSubscribed", isSubscribed);
        response.put("totalSubscriptions", totalSubscriptions);
        response.put("maxParticipants", event.maxParticipants);
        response.put("isFull", event.maxParticipants != null && totalSubscriptions >= event.maxParticipants);
        
        return Response.ok(response).build();
    }

    /**
     * Get all subscriptions for an event (admin only)
     */
    @GET
    @Path("/{id}/subscriptions")
    public Response getEventSubscriptions(@PathParam("id") Long eventId) {
        if (!isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("error", "Admin privileges required"))
                    .build();
        }

        Event event = Event.findById(eventId);
        if (event == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", "Event not found"))
                    .build();
        }

        try {
            List<Subscription> subscriptions = Subscription.findByEvent(event);
            return Response.ok(subscriptions).build();
        } catch (Exception e) {
            LOG.error("Error retrieving event subscriptions", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", "Failed to retrieve subscriptions"))
                    .build();
        }
    }

    /**
     * Get current user's subscriptions
     */
    @GET
    @Path("/my-subscriptions")
    public Response getMySubscriptions() {
        if (!userContext.isAuthenticated()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("error", "Authentication required"))
                    .build();
        }

        try {
            User currentUser = userContext.getCurrentUser();
            List<Subscription> subscriptions = Subscription.findByUser(currentUser);
            return Response.ok(subscriptions).build();
        } catch (Exception e) {
            LOG.error("Error retrieving user subscriptions", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", "Failed to retrieve subscriptions"))
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