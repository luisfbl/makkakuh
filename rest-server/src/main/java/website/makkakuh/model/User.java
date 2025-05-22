package website.makkakuh.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users")
public class User extends PanacheEntity {
    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "bio", length = 4096)
    public String bio;

    @Column(name = "nickname")
    public String nickname;

    @Column(name = "email", unique = true)
    public String email;

    @Column(name = "oauth_id")
    public String oauthId;
    
    @Column(name = "oauth_method")
    public String oauthMethod;

    @Column(name = "picture_url", length = 1024)
    public String pictureUrl;

    @Column(name = "avatar_filename")
    public String avatarFilename;

    @Column(name = "type")
    public String type;
    
    @Column(name = "locale")
    public String locale;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    public List<Subscription> subscriptions;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    public List<UserHonor> honors;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    public UserDetail detail;

    public static User findByEmail(String email) {
        return find("email", email).firstResult();
    }

    public static User findByOauthId(String oauthId, String oauthMethod) {
        return find("oauthId = ?1 and oauthMethod = ?2", oauthId, oauthMethod).firstResult();
    }
}