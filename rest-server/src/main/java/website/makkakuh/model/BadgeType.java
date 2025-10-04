package website.makkakuh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "badge_type")
public class BadgeType extends PanacheEntity {

    @Column(name = "name", nullable = false, unique = true)
    public String name;

    @Column(name = "description")
    public String description;

    @Column(name = "is_avatar_frame", nullable = false)
    public Boolean isAvatarFrame = false;

    @Column(name = "display_order")
    public Integer displayOrder;

    @OneToMany(mappedBy = "badgeType", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    public List<Badge> badges;
}
