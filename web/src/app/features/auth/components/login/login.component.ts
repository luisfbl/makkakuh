import {Component} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../../../core/auth/services/auth.service';
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class LoginComponent {
    isLoading = false;
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    loginWithGoogle(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.authService.initiateOAuth('google').subscribe({
            next: (url) => {
                this.authService.redirectToOAuthProvider(url);
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Falha ao iniciar o login com Google. Tente novamente.';
                this.isLoading = false;
                console.error('Erro no login com Google:', error);
            }
        });
    }
}