import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  GenericModalComponent,
  ModalButton,
} from "../../../../shared/components/generic-modal/generic-modal.component";
import { MuralService } from "../../services/mural.service";
import {
  Achievement,
  AchievementCategory,
} from "../../models/achievement.model";
import { AchievementBadgeComponent } from "../achievement-badge/achievement-badge.component";
import { AdminModeService } from "../../../../core/admin/admin-mode.service";
import { AuthService } from "../../../../core/auth/services/auth.service";
import { ImageUploadComponent } from "../../../../shared/components/image-upload/image-upload.component";

@Component({
  selector: "app-achievement-management",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericModalComponent,
    AchievementBadgeComponent,
    ImageUploadComponent,
  ],
  templateUrl: "./achievement-management.component.html",
  styleUrls: ["./achievement-management.component.scss"],
})
export class AchievementManagementComponent implements OnInit {
  @Output() achievementChanged = new EventEmitter<void>();

  achievements: Achievement[] = [];
  showCreateModal = false;
  showEditModal = false;
  selectedAchievement: Achievement | null = null;
  achievementForm: FormGroup;
  loading = false;
  error = "";
  uploadedIconUrl: string | null = null;

  achievementCategories = [
    { value: AchievementCategory.LEGION, label: "Legião" },
    { value: AchievementCategory.FEAT_HONOR, label: "Feitos e Honrarias" },
    { value: AchievementCategory.RANK, label: "Patentes" },
  ];

  constructor(
    private fb: FormBuilder,
    private muralService: MuralService,
    private authService: AuthService,
    public adminModeService: AdminModeService,
  ) {
    this.achievementForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadAchievements();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      description: [""],
      category: [AchievementCategory.FEAT_HONOR, Validators.required],
      order: [0],
      color: [""],
    });
  }

  loadAchievements(): void {
    this.loading = true;
    this.muralService.getAchievements().subscribe({
      next: (achievements) => {
        this.achievements = achievements.sort(
          (a, b) => (a.order || 0) - (b.order || 0),
        );
        this.loading = false;
      },
      error: (err) => {
        console.error("Erro ao carregar achievements:", err);
        this.error = "Erro ao carregar conquistas";
        this.loading = false;
      },
    });
  }

  openCreateModal(): void {
    this.selectedAchievement = null;
    this.achievementForm.reset({
      name: "",
      description: "",
      category: AchievementCategory.FEAT_HONOR,
      order: 0,
      color: "",
    });
    this.uploadedIconUrl = null;
    this.showCreateModal = true;
    this.error = "";
  }

  openEditModal(achievement: Achievement): void {
    this.selectedAchievement = achievement;
    this.achievementForm.patchValue({
      name: achievement.name,
      description: achievement.description || "",
      category: achievement.category,
      order: achievement.order || 0,
      color: achievement.color || "",
    });
    this.uploadedIconUrl = null;
    this.showEditModal = true;
    this.error = "";
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.selectedAchievement = null;
    this.uploadedIconUrl = null;
    this.error = "";
  }

  onIconUploaded(data: { url: string; filename: string }): void {
    this.uploadedIconUrl = data.url;
    this.error = "";
  }

  onUploadError(error: string): void {
    this.error = error;
    this.uploadedIconUrl = null;
  }

  saveAchievement(): void {
    if (this.achievementForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = "";

    const achievementData = {
      ...this.achievementForm.value,
      isFrameForAvatar:
        this.achievementForm.value.category === AchievementCategory.RANK,
      icon: this.uploadedIconUrl,
    };

    if (this.selectedAchievement) {
      // Update existing achievement
      this.muralService
        .updateAchievement(this.selectedAchievement.id!, achievementData)
        .subscribe({
          next: () => this.onSaveSuccess(),
          error: (err) => this.onSaveError(err),
        });
    } else {
      // Create new achievement
      this.muralService.createAchievement(achievementData).subscribe({
        next: () => this.onSaveSuccess(),
        error: (err) => this.onSaveError(err),
      });
    }
  }

  private onSaveSuccess(): void {
    this.loading = false;
    this.closeModals();
    this.loadAchievements();
    this.achievementChanged.emit();
  }

  private onSaveError(err: any): void {
    console.error("Erro ao salvar achievement:", err);
    this.error = err.error?.message || "Erro ao salvar conquista";
    this.loading = false;
  }

  deleteAchievement(achievement: Achievement): void {
    if (confirm(`Tem certeza que deseja excluir "${achievement.name}"?`)) {
      this.loading = true;
      this.muralService.deleteAchievement(achievement.id!).subscribe({
        next: () => {
          this.loading = false;
          this.loadAchievements();
          this.achievementChanged.emit();
        },
        error: (err) => {
          console.error("Erro ao deletar achievement:", err);
          this.error = "Erro ao excluir conquista";
          this.loading = false;
        },
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.achievementForm.controls).forEach((key) => {
      const control = this.achievementForm.get(key);
      control?.markAsTouched();
    });
  }

  get createModalButtons(): ModalButton[] {
    return [
      {
        label: "Cancelar",
        action: () => this.closeModals(),
        classes: "btn-secondary",
      },
      {
        label: "Criar",
        action: () => this.saveAchievement(),
        classes: "btn-primary",
        disabled: this.loading,
      },
    ];
  }

  get editModalButtons(): ModalButton[] {
    return [
      {
        label: "Cancelar",
        action: () => this.closeModals(),
        classes: "btn-secondary",
      },
      {
        label: "Salvar",
        action: () => this.saveAchievement(),
        classes: "btn-primary",
        disabled: this.loading,
      },
    ];
  }

  getFieldError(fieldName: string): string {
    const control = this.achievementForm.get(fieldName);
    if (control && control.touched && control.errors) {
      if (control.errors["required"]) {
        return "Este campo é obrigatório";
      }
      if (control.errors["minlength"]) {
        return `Mínimo de ${control.errors["minlength"].requiredLength} caracteres`;
      }
    }
    return "";
  }

  getCategoryLabel(category: AchievementCategory): string {
    const categoryObj = this.achievementCategories.find(
      (cat) => cat.value === category,
    );
    return categoryObj ? categoryObj.label : category;
  }

  getLegionAchievements(): Achievement[] {
    return this.achievements.filter(
      (achievement) => achievement.category === AchievementCategory.LEGION,
    );
  }

  getFeatsAndHonorsAchievements(): Achievement[] {
    return this.achievements.filter(
      (achievement) => achievement.category === AchievementCategory.FEAT_HONOR,
    );
  }

  getRankAchievements(): Achievement[] {
    return this.achievements.filter(
      (achievement) => achievement.category === AchievementCategory.RANK,
    );
  }

  get isAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    const isAdminUser = user?.role === "ADMIN";
    const isAdminModeEnabled = this.adminModeService.isAdminModeEnabled;
    return isAdminUser && isAdminModeEnabled;
  }
}
