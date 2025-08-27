package website.makkakuh.model;

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
}