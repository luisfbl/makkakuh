import { Achievement } from './achievement.model';

export interface UserAchievement {
  id?: string;
  userId: string;
  achievementId: string;
  achievement?: Achievement;
  awardedAt?: Date;
}
