export interface BadgeDTO {
  id: number;
  name: string;
  description?: string;
  iconFilename?: string;
  color: string;
  displayOrder?: number;
  awardedAt: string;
  notes?: string;
  badgeType: {
    id: number;
    name: string;
    description?: string;
    isAvatarFrame: boolean;
    displayOrder?: number;
  };
}

export interface User {
  id?: string;
  username: string;
  email?: string;
  name?: string;
  avatarFilename?: string;
  provider: string;
  bio?: string;
  nickname?: string;
  role?: "USER" | "ADMIN";
  badges?: BadgeDTO[];
}

export interface UserResponse {
  user: User;
}
