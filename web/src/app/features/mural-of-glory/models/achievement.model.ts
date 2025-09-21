export enum AchievementCategory {
  LEGION = "LEGION",
  FEAT_HONOR = "FEAT_HONOR",
  RANK = "RANK",
}

export interface Achievement {
  id?: string;
  name: string;
  description?: string;
  icon?: string;
  iconFilename?: string;
  category: AchievementCategory;
  order?: number;
  color?: string;
  isFrameForAvatar?: boolean; // Para patentes que ficam ao redor do avatar
}
