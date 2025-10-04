package website.makkakuh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "badge")
public class Badge extends PanacheEntity {

    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "description")
    public String description;

    @Column(name = "icon_filename")
    public String iconFilename;

    @Column(name = "color")
    public String color;

    @Column(name = "display_order")
    public Integer displayOrder;

    @ManyToOne
    @JoinColumn(name = "badge_type_id", nullable = false)
    public BadgeType badgeType;

    @OneToMany(mappedBy = "badge", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    public List<UserBadge> userBadges;
}
