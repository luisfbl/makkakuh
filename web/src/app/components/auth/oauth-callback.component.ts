import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <p>Processando login, por favor aguarde...</p>
    </div>
  `
})
export class OAuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

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

              this.router.navigate(['/register']);
            } else {
              this.router.navigate(['/account']);
            }
          },
          error: (error: any) => {
            console.error('Erro no processamento do callback OAuth:', error);
            this.router.navigate(['/login']);
          }
        });
      } else {
        console.error('Parâmetros de callback OAuth inválidos');
        this.router.navigate(['/login']);
      }
    });
  }
}