package website.makkakuh.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "event")
public class Event extends PanacheEntity {

    @Column(name = "title", nullable = false)
    public String title;

    @Column(name = "description")
    public String description;

    @Column(name = "date")
    public LocalDateTime date;

    @Column(name = "place")
    public String place;

    @Column(name = "maxParticipants")
    public int maxParticipants;

    @Column(name = "recurrence")
    public String recurrence;

    @OneToMany(mappedBy = "event")
    public List<Subscription> subscriptions;
}