package website.makkakuh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "achievement")
public class Achievement extends PanacheEntity {

    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "description")
    public String description;

    @Column(name = "icon")
    public String icon;

    @Column(name = "icon_filename")
    public String iconFilename;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    public AchievementCategory category;

    @Column(name = "order_position")
    public Integer order;

    @Column(name = "color")
    public String color;

    @Column(name = "is_frame_for_avatar")
    public Boolean isFrameForAvatar = false;

    @OneToMany(mappedBy = "achievement")
    @JsonIgnore
    public List<UserAchievement> userAchievements;

    public enum AchievementCategory {
        LEGION,
        FEAT_HONOR,
        RANK
    }
}
