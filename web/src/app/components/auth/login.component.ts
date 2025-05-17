import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="auth-container">
      <h2>Entrar no Makkakuh</h2>
      
      <div>
        <p>Acesse sua conta para gerenciar suas atividades e participar da comunidade Makkakuh.</p>
      </div>
      
      <div>
        <button (click)="loginWithGoogle()">
          Entrar com Google
        </button>
      </div>
      
      <div *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
      
      <div>
        <p>Novo no Makkakuh? <a routerLink="/register">Crie sua conta</a></p>
      </div>
    </div>
  `
})
export class LoginComponent {
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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