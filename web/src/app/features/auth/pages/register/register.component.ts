import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../../../core/auth/services/auth.service';
import {CommonModule} from "@angular/common";
import {CDNService} from "../../../../core/auth/services/cdn.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    standalone: true,
})
export class RegisterComponent implements OnInit {
    userForm: FormGroup;
    bioForm: FormGroup;
    isLoading = false;
    errorMessage = '';
    showForm = false;
    showBioForm = false;
    oAuthData: any = null;
    userImageUrl: string | null = null;

    constructor(
        private fb: FormBuilder,
        private cdnService: CDNService,
        private authService: AuthService,
        private router: Router
    ) {
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            username: ['', Validators.required]
        });

        this.bioForm = this.fb.group({
            bio: ['']
        });
    }

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/users/@me']);
            return;
        }

        const tempProfile = sessionStorage.getItem('tempUserProfile');
        if (tempProfile) {
            try {
                const profileData = JSON.parse(tempProfile);
                this.oAuthData = profileData;
                this.userImageUrl = this.cdnService.getImageUrl(profileData.avatarFilename, 'avatar');
                this.userForm.patchValue({
                    name: profileData.name || '',
                    username: profileData.email?.split('@')[0] || ''
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

    proceedToBio(): void {
        if (this.userForm.get('username')?.invalid || this.userForm.get('name')?.invalid) {
            return;
        }

        this.showForm = false;
        this.showBioForm = true;
    }

    backToProfile(): void {
        this.showBioForm = false;
        this.showForm = true;
    }

    completeRegistration(): void {
        this.isLoading = true;
        this.errorMessage = '';

        const userData = {
            pictureUrl: this.userImageUrl!!,
            name: this.oAuthData?.name || '',
            email: this.oAuthData?.email || '',
            username: this.userForm.get('username')?.value,
            bio: this.bioForm.get('bio')?.value || ''
        };

        this.authService.completeSignUp(userData).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/users/@me']);
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
        this.showBioForm = false;
        this.oAuthData = null;
        this.userImageUrl = null;
        this.userForm.reset();
        this.bioForm.reset();
    }
}