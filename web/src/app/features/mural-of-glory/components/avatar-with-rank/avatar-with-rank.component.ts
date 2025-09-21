import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAchievement } from '../../models/user-achievement.model';
import { AchievementCategory } from '../../models/achievement.model';
import { CDNService } from '../../../../core/auth/services/cdn.service';

@Component({
  selector: 'app-avatar-with-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-with-rank.component.html',
  styleUrls: ['./avatar-with-rank.component.scss']
})
export class AvatarWithRankComponent implements OnInit {
  @Input() avatarFilename?: string;
  @Input() pictureUrl?: string;
  @Input() name: string = '';
  @Input() achievements: UserAchievement[] = [];
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  avatarUrl: string | null = null;
  rankAchievements: UserAchievement[] = [];

  constructor(private cdnService: CDNService) {}

  ngOnInit(): void {
    this.setAvatarUrl();
    this.filterRankAchievements();
  }

  private setAvatarUrl(): void {
    if (this.avatarFilename) {
      this.avatarUrl = this.cdnService.getImageUrl(this.avatarFilename, 'avatar');
    } else if (this.pictureUrl) {
      this.avatarUrl = this.pictureUrl;
    }
  }

  private filterRankAchievements(): void {
    this.rankAchievements = this.achievements.filter(
      achievement => achievement.achievement?.category === AchievementCategory.RANK &&
                   achievement.achievement?.isFrameForAvatar === true
    );
  }

  get sizeClass(): string {
    return `avatar-${this.size}`;
  }

  get initials(): string {
    return this.name?.charAt(0)?.toUpperCase() || 'U';
  }

  getRankFrameUrl(achievement: UserAchievement): string {
    if (achievement.achievement?.iconFilename) {
      return `/assets/achievements/${achievement.achievement.iconFilename}`;
    }
    return achievement.achievement?.icon || '';
  }
}
