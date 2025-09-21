import { User } from "../../../core/auth/models/user.model";
import { UserDetail } from "./user-detail.model";
import { UserAchievement } from "./user-achievement.model";
import { AchievementCategory } from "./achievement.model";

export interface MemberProfile {
  user: User;
  userDetail: UserDetail;
  achievements: UserAchievement[];
}

export interface AchievementsByCategory {
  [AchievementCategory.LEGION]: UserAchievement[];
  [AchievementCategory.FEAT_HONOR]: UserAchievement[];
  [AchievementCategory.RANK]: UserAchievement[];
}
