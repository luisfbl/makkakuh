package website.makkakuh.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class EventRequest {
    @NotBlank(message = "Title is required")
    public String title;

    @NotBlank(message = "Description is required")
    public String description;

    @NotNull(message = "Date is required")
    public LocalDate date;

    @NotBlank(message = "Place is required")
    public String place;

    public Integer maxParticipants;

    public String recurrence = "none";

    public EventRequest() {
    }

    public EventRequest(String title, String description, LocalDate date, String place, Integer maxParticipants, String recurrence) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.place = place;
        this.maxParticipants = maxParticipants;
        this.recurrence = recurrence != null ? recurrence : "none";
    }

    public Event toEntity() {
        Event event = new Event();
        event.title = this.title;
        event.description = this.description;
        event.date = this.date;
        event.place = this.place;
        event.maxParticipants = this.maxParticipants;
        event.recurrence = this.recurrence;
        return event;
    }
}