package website.makkakuh.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users")
public class User extends PanacheEntity {
    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "bio")
    public String bio;

    @Column(name = "nickname")
    public String nickname;

    @Column(name = "email", unique = true)
    public String email;

    @Column(name = "oauthMethod")
    public String oauthMethod;

    @Column(name = "type")
    public String type;

    @OneToMany(mappedBy = "user")
    public List<Subscription> subscriptions;

    @OneToMany(mappedBy = "user")
    public List<UserHonor> honors;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    public UserDetail detail;
}