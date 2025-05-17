import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <h2>Cadastrar no Makkakuh</h2>
      
      <div>
        <p>Crie sua conta para participar da comunidade Makkakuh.</p>
      </div>
      
      <div>
        <button (click)="registerWithGoogle()">
          Cadastrar com Google
        </button>
      </div>
      
      <div *ngIf="showForm">
        <form [formGroup]="userForm" (ngSubmit)="completeRegistration()">
          <div>
            <label for="fullName">Nome completo</label>
            <input 
              type="text" 
              id="fullName" 
              formControlName="fullName" 
              placeholder="Digite seu nome completo"
            >
            <div *ngIf="userForm.get('fullName')?.errors?.['required'] && userForm.get('fullName')?.touched">
              Nome completo é obrigatório
            </div>
          </div>
          
          <div>
            <label for="username">Nome de usuário</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              placeholder="Escolha um nome de usuário"
            >
            <div *ngIf="userForm.get('username')?.errors?.['required'] && userForm.get('username')?.touched">
              Nome de usuário é obrigatório
            </div>
          </div>
          
          <div>
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              placeholder="Digite seu email"
              [readOnly]="!!oAuthData"
            >
            <div *ngIf="userForm.get('email')?.errors?.['required'] && userForm.get('email')?.touched">
              Email é obrigatório
            </div>
            <div *ngIf="userForm.get('email')?.errors?.['email'] && userForm.get('email')?.touched">
              Email inválido
            </div>
          </div>
          
          <button 
            type="submit" 
            [disabled]="userForm.invalid || isLoading"
          >
            {{ isLoading ? 'Processando...' : 'Completar Cadastro' }}
          </button>
        </form>
      </div>
      
      <div *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
      
      <div>
        <p>Já tem uma conta? <a routerLink="/login">Entrar</a></p>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showForm = false;
  oAuthData: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/account']);
      return;
    }

    const tempProfile = sessionStorage.getItem('tempUserProfile');
    if (tempProfile) {
      try {
        const profileData = JSON.parse(tempProfile);
        this.oAuthData = profileData;
        this.userForm.patchValue({
          fullName: profileData.name || '',
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
      ...this.userForm.value,
      active: true
    };

    this.authService.completeSignUp(userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/account']);
      },
      error: (error: any) => {
        this.errorMessage = 'Falha ao completar o cadastro. Verifique os dados e tente novamente.';
        this.isLoading = false;
        console.error('Erro ao completar cadastro:', error);
      }
    });
  }
}