package website.makkakuh.dto;

import website.makkakuh.model.Badge;
import website.makkakuh.model.User;
import website.makkakuh.model.UserBadge;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class UserWithBadgesDTO {
    public Long id;
    public String name;
    public String bio;
    public String nickname;
    public String email;
    public String avatarFilename;
    public String role;
    public List<BadgeDTO> badges;

    public static class BadgeDTO {
        public Long id;
        public String name;
        public String description;
        public String iconFilename;
        public String color;
        public Integer displayOrder;
        public LocalDateTime awardedAt;
        public String notes;
        public BadgeTypeDTO badgeType;

        public static class BadgeTypeDTO {
            public Long id;
            public String name;
            public String description;
            public Boolean isAvatarFrame;
            public Integer displayOrder;
        }
    }

    public static UserWithBadgesDTO fromUser(User user) {
        UserWithBadgesDTO dto = new UserWithBadgesDTO();
        dto.id = user.id;
        dto.name = user.name;
        dto.bio = user.bio;
        dto.nickname = user.nickname;
        dto.email = user.email;
        dto.avatarFilename = user.avatarFilename;
        dto.role = user.role;

        if (user.badges != null) {
            dto.badges = user.badges.stream()
                .map(UserWithBadgesDTO::fromUserBadge)
                .collect(Collectors.toList());
        }

        return dto;
    }

    private static BadgeDTO fromUserBadge(UserBadge userBadge) {
        BadgeDTO dto = new BadgeDTO();
        Badge badge = userBadge.badge;

        dto.id = userBadge.id;
        dto.name = badge.name;
        dto.description = badge.description;
        dto.iconFilename = badge.iconFilename;
        dto.color = badge.color;
        dto.displayOrder = badge.displayOrder;
        dto.awardedAt = userBadge.awardedAt;
        dto.notes = userBadge.notes;

        BadgeDTO.BadgeTypeDTO typeDto = new BadgeDTO.BadgeTypeDTO();
        typeDto.id = badge.badgeType.id;
        typeDto.name = badge.badgeType.name;
        typeDto.description = badge.badgeType.description;
        typeDto.isAvatarFrame = badge.badgeType.isAvatarFrame;
        typeDto.displayOrder = badge.badgeType.displayOrder;
        dto.badgeType = typeDto;

        return dto;
    }
}
