import {Component, Input, OnInit} from '@angular/core';
import {Honor} from '../../models/honor.model';
import {CommonModule} from '@angular/common';
import {CDNService} from '../../../../core/auth/services/cdn.service';

@Component({
    selector: 'app-honor-badge',
    templateUrl: './honor-badge.component.html',
    styleUrls: ['./honor-badge.component.scss'],
    standalone: true,
    imports: [
        CommonModule
    ]
})
export class HonorBadgeComponent implements OnInit {
    @Input() honor?: Honor;
    honorIconUrl: string | null = null;

    constructor(private cdnService: CDNService) {
    }

    ngOnInit(): void {
        if (this.honor) {
            if (this.honor.iconFilename) {
                this.honorIconUrl = this.cdnService.getImageUrl(this.honor.iconFilename, 'honor');
            } else if (this.honor.icon) {
                if (this.honor.icon.startsWith('http')) {
                    this.honorIconUrl = this.honor.icon;
                } else {
                    this.honorIconUrl = '/assets/honors/' + this.honor.icon;
                }
            }
        }
    }
}
