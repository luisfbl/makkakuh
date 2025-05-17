import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="account-container">
      <h2>Minha Conta</h2>
      
      <div *ngIf="user">
        <div>
          <h3>Informações do Perfil</h3>
          <p><strong>Nome:</strong> {{ user.fullName }}</p>
          <p><strong>Usuário:</strong> {{ user.username }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
        </div>
        
        <div>
          <button (click)="logout()">Sair</button>
        </div>
      </div>
      
      <div *ngIf="!user">
        <p>Carregando informações da conta...</p>
      </div>
    </div>
  `
})
export class AccountComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.user = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}