package website.makkakuh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "subscriptions")
public class Subscription extends PanacheEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    public User user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnore
    public Event event;

    @Column(name = "date")
    public LocalDateTime date = LocalDateTime.now();

    // Custom queries
    public static Subscription findByUserAndEvent(User user, Event event) {
        return find("user = ?1 and event = ?2", user, event).firstResult();
    }

    public static List<Subscription> findByUser(User user) {
        return list("user = ?1 order by date desc", user);
    }

    public static List<Subscription> findByEvent(Event event) {
        return list("event = ?1 order by date desc", event);
    }

    public static long countByEvent(Event event) {
        return count("event", event);
    }

    public static boolean isUserSubscribed(User user, Event event) {
        return findByUserAndEvent(user, event) != null;
    }

    public static List<Subscription> findByEventPaginated(Event event, int page, int size) {
        return find("event = ?1 order by date desc", event)
                .page(page, size)
                .list();
    }

    public static List<Subscription> findByEventWithSearch(Event event, String searchTerm, int page, int size) {
        String query = "event = ?1 and (LOWER(user.name) LIKE LOWER(?2) or LOWER(user.nickname) LIKE LOWER(?2)) order by date desc";
        String searchPattern = "%" + searchTerm + "%";
        return find(query, event, searchPattern)
                .page(page, size)
                .list();
    }

    public static long countByEventWithSearch(Event event, String searchTerm) {
        String query = "event = ?1 and (LOWER(user.name) LIKE LOWER(?2) or LOWER(user.nickname) LIKE LOWER(?2))";
        String searchPattern = "%" + searchTerm + "%";
        return count(query, event, searchPattern);
    }
}