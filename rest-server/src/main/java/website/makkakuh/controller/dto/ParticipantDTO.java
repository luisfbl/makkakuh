package website.makkakuh.controller.dto;

import java.time.LocalDateTime;
import website.makkakuh.model.Subscription;

public class ParticipantDTO {

    public Long id;
    public UserDTO user;
    public LocalDateTime date;

    public ParticipantDTO() {}

    public ParticipantDTO(Subscription subscription) {
        this.id = subscription.id;
        // Refresh user data to get the latest information from database
        website.makkakuh.model.User freshUser =
            website.makkakuh.model.User.findById(subscription.user.id);
        this.user = new UserDTO(
            freshUser != null ? freshUser : subscription.user
        );
        this.date = subscription.date;
    }

    public static class UserDTO {

        public Long id;
        public String name;
        public String nickname;
        public String avatarFilename;

        public UserDTO() {}

        public UserDTO(website.makkakuh.model.User user) {
            this.id = user.id;
            this.name = user.name;
            this.nickname = user.nickname;
            this.avatarFilename = user.avatarFilename;
        }
    }
}
