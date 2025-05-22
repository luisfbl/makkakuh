package website.makkakuh.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.List;

@Entity
@Table(name = "honor")
public class Honor extends PanacheEntity {

    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "icon")
    public String icon;
    
    @Column(name = "icon_filename")
    public String iconFilename;

    @OneToMany(mappedBy = "honor")
    public List<UserHonor> userHonors;
}