package website.makkakuh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_achievements")
public class UserAchievement extends PanacheEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    public User user;

    @ManyToOne
    @JoinColumn(name = "achievement_id", nullable = false)
    public Achievement achievement;

    @Column(name = "awarded_at")
    public LocalDateTime awardedAt;

    @PrePersist
    public void prePersist() {
        if (awardedAt == null) {
            awardedAt = LocalDateTime.now();
        }
    }
}
