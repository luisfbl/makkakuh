import { Component, Input } from "@angular/core";
import { MemberProfile } from "../../models/member-profile.model";
import { AchievementBadgeComponent } from "../achievement-badge/achievement-badge.component";
import { AvatarWithRankComponent } from "../avatar-with-rank/avatar-with-rank.component";
import { AchievementCategory } from "../../models/achievement.model";
import { UserAchievement } from "../../models/user-achievement.model";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-member-card",
  templateUrl: "./member-card.component.html",
  styleUrls: ["./member-card.component.scss"],
  imports: [CommonModule, AchievementBadgeComponent, AvatarWithRankComponent],
  standalone: true,
})
export class MemberCardComponent {
  @Input() member!: MemberProfile;
  expanded = false;

  toggleExpand(): void {
    this.expanded = !this.expanded;
  }

  getDanLevel(dan: number): string {
    const romans = [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
    ];
    return dan > 0 && dan <= romans.length ? romans[dan - 1] : dan.toString();
  }

  getStars(count: number): number[] {
    return Array(count)
      .fill(0)
      .map((_, i) => i);
  }

  getBioSizeClass(bio: string): string {
    if (!bio || bio.trim().length === 0) {
      return "bio-empty";
    }

    const length = bio.trim().length;

    if (length <= 100) {
      return "bio-short";
    } else if (length <= 300) {
      return "bio-medium";
    } else {
      return "bio-long";
    }
  }

  getLegionAchievements(): UserAchievement[] {
    return (
      this.member.achievements?.filter(
        (achievement) =>
          achievement.achievement?.category === AchievementCategory.LEGION,
      ) || []
    );
  }

  getFeatsAndHonorsAchievements(): UserAchievement[] {
    return (
      this.member.achievements?.filter(
        (achievement) =>
          achievement.achievement?.category === AchievementCategory.FEAT_HONOR,
      ) || []
    );
  }

  getRankAchievements(): UserAchievement[] {
    return (
      this.member.achievements?.filter(
        (achievement) =>
          achievement.achievement?.category === AchievementCategory.RANK,
      ) || []
    );
  }
}
