import {Component, OnInit} from '@angular/core';
import {MuralService} from '../../services/mural.service';
import {MemberProfile} from '../../models/member-profile.model';
import {LoadingComponent} from "../../../../shared/components/loading.component";
import {MemberCardComponent} from "../../components/member-card/member-card.component";
import {HonorManagementComponent} from '../../components/honor-management/honor-management.component';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../../core/auth/services/auth.service';

@Component({
    selector: 'app-mural-page',
    templateUrl: './mural-page.component.html',
    styleUrls: ['./mural-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        LoadingComponent,
        MemberCardComponent,
        HonorManagementComponent
    ]
})
export class MuralPageComponent implements OnInit {
    members: MemberProfile[] = [];
    loading = true;
    error = false;

    currentPage = 0;
    pageSize = 9;
    totalPages = 0;
    totalItems = 0;

    constructor(
        private muralService: MuralService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.loadMembers();
    }

    loadMembers(page: number = 0): void {
        this.loading = true;
        this.error = false;
        this.currentPage = page;

        this.muralService.getMemberProfiles(page, this.pageSize).subscribe({
            next: (response) => {
                this.members = response.profiles;
                this.totalPages = response.pagination.totalPages;
                this.totalItems = response.pagination.totalItems;
                this.currentPage = response.pagination.page;
                this.loading = false;
            },
            error: (err) => {
                console.error('Erro ao carregar perfis:', err);
                this.error = true;
                this.loading = false;
            }
        });
    }

    goToPage(page: number): void {
        if (page >= 0 && page < this.totalPages) {
            this.loadMembers(page);
        }
    }

    get pages(): number[] {
        const maxVisiblePages = 5;
        const startPage = Math.max(0, Math.min(
            this.currentPage - Math.floor(maxVisiblePages / 2),
            this.totalPages - maxVisiblePages
        ));

        const endPage = Math.min(startPage + maxVisiblePages, this.totalPages);

        return Array.from({length: endPage - startPage}, (_, i) => startPage + i);
    }

    get isAdmin(): boolean {
        return this.authService.isAdmin();
    }

    onHonorChanged(): void {
        // Reload members to reflect any changes in their honors
        this.loadMembers(this.currentPage);
    }
}
