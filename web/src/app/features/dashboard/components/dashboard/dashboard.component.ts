import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/auth/services/auth.service';
import {CDNService} from '../../../../core/auth/services/cdn.service';
import {User} from '../../../../core/auth/models/user.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {ImageUploadComponent} from "../../../../shared/components/image-upload/image-upload.component";

@Component({
    selector: 'app-account',
    templateUrl: './dashboard.component.html',
    imports: [
        ImageUploadComponent
    ],
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    user: User | null = null;

    apiUrl = environment.apiUrl || '/api';
    avatarUrl: string | null = null;
    isUploading = false;
    uploadError: string | null = null;

    constructor(
        private authService: AuthService,
        private router: Router,
        private cdnService: CDNService,
        private http: HttpClient
    ) {
    }

    ngOnInit(): void {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/auth/login']);
            return;
        }

        this.user = this.authService.getCurrentUser();
        console.log(this.user);
        
        // Verificar se o usuário tem um avatar
        if (this.user) {
            if (this.user.avatarFilename) {
                this.avatarUrl = this.cdnService.getImageUrl(this.user.avatarFilename, 'avatar');
            } else if (this.user.pictureUrl) {
                this.avatarUrl = this.user.pictureUrl;
            }
        }
    }
    
    onImageUploaded(event: { url: string, filename: string }): void {
        if (this.user) {
            this.isUploading = false;
            
            // Atualizar o usuário com o novo avatar
            this.http.put(`${this.apiUrl}/users/${this.user.id}`, {
                avatarFilename: event.filename
            }).subscribe({
                next: (response: any) => {
                    // Atualizar o usuário local
                    if (this.user) {
                        this.user.avatarFilename = event.filename;
                        this.avatarUrl = event.url;
                        
                        // Atualizar o usuário no serviço de autenticação
                        this.authService.updateCurrentUser(this.user);
                    }
                },
                error: (error) => {
                    console.error('Erro ao atualizar avatar:', error);
                    this.uploadError = 'Erro ao salvar o avatar. Tente novamente mais tarde.';
                }
            });
        }
    }
    
    onUploadError(error: string): void {
        this.uploadError = error;
        this.isUploading = false;
    }

    logout(): void {
        this.authService.logout();
    }
}