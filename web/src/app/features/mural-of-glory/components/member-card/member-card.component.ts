import {Component, Input} from '@angular/core';
import {MemberProfile} from '../../models/member-profile.model';
import {HonorBadgeComponent} from "../honor-badge/honor-badge.component";
import {CommonModule} from '@angular/common';
import {CDNService} from '../../../../core/auth/services/cdn.service';

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.scss'],
    imports: [
        CommonModule,
        HonorBadgeComponent
    ],
    standalone: true
})
export class MemberCardComponent {
    @Input() member!: MemberProfile;
    expanded = false;
    avatarUrl: string | null = null;

    constructor(private cdnService: CDNService) {
    }

    ngOnInit(): void {
        if (this.member?.user?.avatarFilename) {
            this.avatarUrl = this.cdnService.getImageUrl(this.member.user.avatarFilename, 'avatar');
        } else if (this.member?.user?.pictureUrl) {
            this.avatarUrl = this.member.user.pictureUrl;
        }
    }

    toggleExpand(): void {
        this.expanded = !this.expanded;
    }

    getDanLevel(dan: number): string {
        const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        return dan > 0 && dan <= romans.length ? romans[dan - 1] : dan.toString();
    }

    getStars(count: number): number[] {
        return Array(count).fill(0).map((_, i) => i);
    }

    getBioSizeClass(bio: string): string {
        if (!bio || bio.trim().length === 0) {
            return 'bio-empty';
        }

        const length = bio.trim().length;

        if (length <= 100) {
            return 'bio-short';
        } else if (length <= 300) {
            return 'bio-medium';
        } else {
            return 'bio-long';
        }
    }
}
