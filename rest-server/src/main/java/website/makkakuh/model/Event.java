package website.makkakuh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "event")
public class Event extends PanacheEntity {

    @Column(name = "title", nullable = false)
    public String title;

    @Column(name = "description", length = 4096)
    public String description;

    @Column(name = "date", nullable = false)
    public LocalDate date;

    @Column(name = "time")
    public LocalTime time;

    @Column(name = "place", nullable = false)
    public String place;

    @Column(name = "maxParticipants")
    public Integer maxParticipants; // Nullable integer

    @Column(name = "recurrence")
    public String recurrence = "none"; // Default value

    @OneToMany(mappedBy = "event", fetch = FetchType.LAZY)
    @JsonIgnore
    public List<Subscription> subscriptions;

    // Custom queries
    public static List<Event> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return list("date >= ?1 and date <= ?2 order by date asc", startDate, endDate);
    }

    public static List<Event> findUpcoming() {
        return list("date >= ?1 order by date asc", LocalDate.now());
    }

    public static List<Event> findAllOrdered() {
        return list("order by date asc");
    }
}