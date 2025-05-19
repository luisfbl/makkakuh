import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../../../core/auth/services/auth.service';
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    standalone: true,
})
export class RegisterComponent implements OnInit {
    userForm: FormGroup;
    isLoading = false;
    errorMessage = '';
    showForm = false;
    oAuthData: any = null;
    userImageUrl: string | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
            return;
        }

        const tempProfile = sessionStorage.getItem('tempUserProfile');
        if (tempProfile) {
            try {
                const profileData = JSON.parse(tempProfile);
                this.oAuthData = profileData;
                this.userImageUrl = profileData.pictureUrl;
                this.userForm.patchValue({
                    name: profileData.name || '',
                    username: profileData.email?.split('@')[0] || '',
                    email: profileData.email || ''
                });

                this.showForm = true;
                sessionStorage.removeItem('tempUserProfile');
            } catch (e) {
                console.error('Erro ao processar dados temporários do perfil:', e);
            }
        }
    }

    registerWithGoogle(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.authService.initiateOAuth('google').subscribe({
            next: (url) => {
                this.authService.redirectToOAuthProvider(url);
                this.isLoading = false;
            },
            error: (error: any) => {
                this.errorMessage = 'Falha ao iniciar o cadastro com Google. Tente novamente.';
                this.isLoading = false;
                console.error('Erro no cadastro com Google:', error);
            }
        });
    }

    completeRegistration(): void {
        if (this.userForm.invalid) {
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const userData = {
            pictureUrl: this.userImageUrl,
            ...this.userForm.value
        };

        this.authService.completeSignUp(userData).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/dashboard']);
            },
            error: (error: any) => {
                this.errorMessage = 'Falha ao completar o cadastro. Verifique os dados e tente novamente.';
                this.isLoading = false;
                console.error('Erro ao completar cadastro:', error);
            }
        });
    }

    cancelRegistration(): void {
        sessionStorage.removeItem('tempUserProfile');
        this.showForm = false;
        this.oAuthData = null;
        this.userImageUrl = null;
        this.userForm.reset();
    }
}