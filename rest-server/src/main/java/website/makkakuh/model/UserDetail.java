package website.makkakuh.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "user_detail")
public class UserDetail extends PanacheEntity {

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    public User user;

    @Column(name = "patent")
    public String patent;

    @Column(name = "dan")
    public int dan;

    @Column(name = "battleStarAmount")
    public int battleStarAmount;

    @Column(name = "statusStarAmount")
    public int statusStarAmount;
}