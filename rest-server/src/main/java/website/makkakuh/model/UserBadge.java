package website.makkakuh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_badge")
public class UserBadge extends PanacheEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    public User user;

    @ManyToOne
    @JoinColumn(name = "badge_id", nullable = false)
    public Badge badge;

    @Column(name = "awarded_at")
    public LocalDateTime awardedAt;

    @Column(name = "notes")
    public String notes;

    @PrePersist
    public void prePersist() {
        if (awardedAt == null) {
            awardedAt = LocalDateTime.now();
        }
    }
}
