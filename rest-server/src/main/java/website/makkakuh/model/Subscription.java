package website.makkakuh.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

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
    public LocalDateTime date;
}