import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {AuthService} from '../../../../core/auth/services/auth.service';
import {CommonModule} from "@angular/common";
import {LoadingComponent} from "../../../../shared/components/loading.component";

@Component({
    selector: 'app-oauth-callback',
    templateUrl: './oauth-callback.component.html',
    styleUrls: ['./oauth-callback.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, LoadingComponent]
})
export class OAuthCallbackComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const code = params['code'];
            const state = params['state'];
            const provider = this.route.snapshot.paramMap.get('provider');

            if (code && state && provider) {
                this.authService.handleOAuthCallback(provider, code, state).subscribe({
                    next: (response: any) => {
                        if (response.isNewUser) {
                            if (response.userProfile) {
                                sessionStorage.setItem('tempUserProfile', JSON.stringify(response.userProfile));
                            }

                            this.router.navigate(['/auth/register']);
                        } else {
                            this.router.navigate(['/dashboard']);
                        }
                    },
                    error: (error: any) => {
                        console.error('Erro no processamento do callback OAuth:', error);
                        this.router.navigate(['/auth/login']);
                    }
                });
            } else {
                console.error('Parâmetros de callback OAuth inválidos');
                this.router.navigate(['/auth/login']);
            }
        });
    }
}