package website.makkakuh.controller.dto;

import website.makkakuh.model.Subscription;

import java.time.LocalDateTime;

public class ParticipantDTO {
    public Long id;
    public UserDTO user;
    public LocalDateTime date;

    public ParticipantDTO() {}

    public ParticipantDTO(Subscription subscription) {
        this.id = subscription.id;
        this.user = new UserDTO(subscription.user);
        this.date = subscription.date;
    }

    public static class UserDTO {
        public Long id;
        public String name;
        public String nickname;
        public String pictureUrl;

        public UserDTO() {}

        public UserDTO(website.makkakuh.model.User user) {
            this.id = user.id;
            this.name = user.name;
            this.nickname = user.nickname;
            this.pictureUrl = user.pictureUrl;
        }
    }
}