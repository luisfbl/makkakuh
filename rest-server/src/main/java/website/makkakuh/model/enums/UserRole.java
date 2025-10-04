package website.makkakuh.model.enums;

public enum UserRole {
    USER,
    ADMIN;

    public static UserRole fromString(String role) {
        if (role == null || role.isEmpty()) {
            return USER;
        }
        try {
            return UserRole.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            return USER;
        }
    }
}
