import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Achievement, AchievementCategory } from '../../models/achievement.model';
import { UserAchievement } from '../../models/user-achievement.model';

@Component({
  selector: 'app-achievement-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievement-badge.component.html',
  styleUrls: ['./achievement-badge.component.scss']
})
export class AchievementBadgeComponent {
  @Input() achievement!: Achievement;
  @Input() userAchievement?: UserAchievement;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showName = true;
  @Input() showDescription = false;

  get categoryClass(): string {
    switch (this.achievement.category) {
      case AchievementCategory.LEGION:
        return 'achievement-legion';
      case AchievementCategory.FEAT_HONOR:
        return 'achievement-feat-honor';
      case AchievementCategory.RANK:
        return 'achievement-rank';
      default:
        return '';
    }
  }

  get isFrameForAvatar(): boolean {
    return this.achievement.isFrameForAvatar === true;
  }

  get iconUrl(): string {
    if (this.achievement.iconFilename) {
      return `/assets/achievements/${this.achievement.iconFilename}`;
    }
    return this.achievement.icon || '/assets/achievements/default.png';
  }
}
