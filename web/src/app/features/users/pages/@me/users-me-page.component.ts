import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { User } from "../../../../core/auth/models/user.model";
import { AuthService } from "../../../../core/auth/services/auth.service";
import { CDNService } from "../../../../core/auth/services/cdn.service";
import { HttpClient } from "@angular/common/http";
import { ImageUploadComponent } from "../../../../shared/components/image-upload/image-upload.component";
import { LoadingComponent } from "../../../../shared/components/loading.component";

@Component({
  selector: "app-users-me-page",
  templateUrl: "./users-me-page.component.html",
  styleUrls: ["./users-me-page.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ImageUploadComponent,
    LoadingComponent,
  ],
})
export class UsersMePageComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;
  loading = true;
  isSubmitting = false;
  error: string | null = null;
  successMessage: string | null = null;
  uploadError: string | null = null;
  avatarUrl: string | null = null;

  private apiUrl = "/api";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cdnService: CDNService,
    private router: Router,
    private http: HttpClient,
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      nickname: [""],
      email: [{ value: "", disabled: true }],
      bio: ["", [Validators.maxLength(500)]],
    });
  }

  loadUserData(): void {
    this.loading = true;
    this.error = null;

    // First try to get user from current state
    this.user = this.authService.getCurrentUser();

    if (this.user) {
      this.populateForm();
      this.loading = false;
    } else {
      // If no user in state, verify with API
      this.authService.verifyAuthentication().subscribe({
        next: (user) => {
          if (user) {
            this.user = user;
            this.populateForm();
          } else {
            this.error = "Não foi possível carregar os dados do usuário.";
          }
          this.loading = false;
        },
        error: (error) => {
          console.error("Error loading user data:", error);
          this.error = "Não foi possível carregar os dados do usuário.";
          this.loading = false;
        },
      });
    }
  }

  private populateForm(): void {
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name || "",
        nickname: this.user.nickname || "",
        email: this.user.email || "",
        bio: this.user.bio || "",
      });
      this.setupAvatar();
    }
  }

  private setupAvatar(): void {
    if (this.user && this.user.avatarFilename) {
      this.avatarUrl = this.cdnService.getImageUrl(
        this.user.avatarFilename,
        "avatar",
      );
    }
  }

  onAvatarUploaded(event: { url: string; filename: string }): void {
    this.uploadError = null;

    if (this.user) {
      this.http
        .put(`${this.apiUrl}/users/@me`, {
          avatarFilename: event.filename,
        })
        .subscribe({
          next: (response: any) => {
            if (this.user) {
              this.user.avatarFilename = event.filename;
              this.avatarUrl = event.url;

              this.authService.updateCurrentUser(this.user);
            }
          },
          error: (error) => {
            console.error("Erro ao atualizar avatar:", error);
            this.uploadError = "Erro ao salvar o avatar. Tente novamente.";
          },
        });
    }
  }

  onUploadError(error: string): void {
    this.uploadError = error;
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.user) {
      this.isSubmitting = true;
      this.error = null;

      const formData = this.profileForm.value;
      const updateData = {
        name: formData.name,
        nickname: formData.nickname || null,
        bio: formData.bio || null,
      };

      this.http.put(`${this.apiUrl}/users/@me`, updateData).subscribe({
        next: (response: any) => {
          if (this.user) {
            this.user.name = updateData.name;
            this.user.nickname = updateData.nickname;
            this.user.bio = updateData.bio;

            this.authService.updateCurrentUser(this.user);
          }

          this.isSubmitting = false;
          this.showSuccessMessage("Perfil atualizado com sucesso!");
        },
        error: (error) => {
          console.error("Erro ao atualizar perfil:", error);
          this.error = this.getErrorMessage(error);
          this.isSubmitting = false;
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach((key) => {
      const control = this.profileForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    }

    switch (error.status) {
      case 400:
        return "Dados inválidos. Verifique as informações e tente novamente.";
      case 401:
        return "Você precisa estar logado para atualizar o perfil.";
      case 403:
        return "Você não tem permissão para realizar esta ação.";
      case 404:
        return "Usuário não encontrado.";
      case 500:
        return "Erro interno do servidor. Tente novamente mais tarde.";
      default:
        return "Erro ao atualizar perfil. Tente novamente.";
    }
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;

    setTimeout(() => {
      this.successMessage = null;
      this.router.navigate(["/users/@me"]);
    }, 3000);
  }

  onCancel(): void {
    if (this.profileForm.dirty) {
      const confirmLeave = confirm(
        "Você tem alterações não salvas. Deseja sair mesmo assim?",
      );
      if (!confirmLeave) {
        return;
      }
    }

    this.router.navigate(["/users/@me"]);
  }
}
