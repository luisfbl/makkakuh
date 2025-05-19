import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/auth/services/auth.service';
import {User} from '../../../../core/auth/models/user.model';

@Component({
    selector: 'app-account',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    user: User | null = null;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/auth/login']);
            return;
        }

        this.user = this.authService.getCurrentUser();
        console.log(this.user)
    }

    logout(): void {
        this.authService.logout();
    }
}