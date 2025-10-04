import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { BadgeService } from "../../services/badge.service";
import { BadgeType } from "../../models/badge-type.model";
import { Badge } from "../../models/badge.model";
import { User, BadgeDTO } from "../../../../core/auth/models/user.model";
import { AdminModeService } from "../../../../core/admin/admin-mode.service";
import { Router } from "@angular/router";
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { SearchBarComponent } from "../../../../shared/components/search-bar/search-bar.component";
import { PaginationComponent } from "../../../../shared/components/pagination/pagination.component";
import { EmptyStateComponent } from "../../../../shared/components/empty-state/empty-state.component";

interface UserWithBadges {
  user: User;
  badges: BadgeDTO[];
}

@Component({
  selector: "app-mural-page",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    SearchBarComponent,
    PaginationComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./mural-page.component.html",
  styleUrls: ["./mural-page.component.scss"],
})
export class MuralPageComponent implements OnInit {
  badgeTypes: BadgeType[] = [];
  allBadges: Badge[] = [];
  usersWithBadges: UserWithBadges[] = [];
  filteredUsers: UserWithBadges[] = [];
  isAdminMode = false;

  // Paginação
  currentPage = 0;
  pageSize = 9;
  totalPages = 0;
  paginatedUsers: UserWithBadges[] = [];
  totalFilteredUsers = 0;

  // Modals
  showTypeModal = false;
  showBadgeModal = false;
  showAssignModal = false;
  showUserSettingsModal = false;

  // Badge Type Form
  editingType: BadgeType | null = null;
  typeFormData = {
    name: "",
    description: "",
    isAvatarFrame: false,
    displayOrder: 0,
  };

  // Badge Form
  editingBadge: Badge | null = null;
  selectedBadgeFile: File | null = null;
  badgeFormData = {
    name: "",
    description: "",
    badgeTypeId: 0,
    color: "#f4d03f",
    displayOrder: 0,
  };

  // Assign Badge
  assignUser: User | null = null;
  selectedBadgeForAssign: Badge | null = null;
  assignNotes = "";

  // User Settings
  settingsUser: User | null = null;

  constructor(
    private http: HttpClient,
    private badgeService: BadgeService,
    private adminModeService: AdminModeService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.adminModeService.isAdminModeActive$.subscribe((isAdmin: boolean) => {
      this.isAdminMode = isAdmin;
    });

    this.loadData();
  }

  loadData() {
    this.badgeService.getAllBadgeTypes().subscribe({
      next: (types) => {
        this.badgeTypes = types.sort(
          (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
        );
      },
    });

    this.badgeService.getAllBadges().subscribe({
      next: (badges) => {
        this.allBadges = badges;
      },
    });

    this.loadUsers();
  }

  loadUsers(searchTerm: string = "") {
    let url = "/api/users";
    if (searchTerm.trim()) {
      url += `?search=${encodeURIComponent(searchTerm.trim())}`;
    }

    this.http.get<User[]>(url).subscribe({
      next: (users) => {
        this.usersWithBadges = users
          .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
          .map((user) => ({
            user: user,
            badges: user.badges || [],
          }));

        this.filteredUsers = this.usersWithBadges;
        this.totalFilteredUsers = this.filteredUsers.length;
        this.currentPage = 0;
        this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
        this.updatePaginatedUsers();
      },
    });
  }

  updatePaginatedUsers() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  onSearchChanged(searchTerm: string) {
    this.loadUsers(searchTerm);
  }

  getBadgesByType(userWithBadges: UserWithBadges, typeId: number): BadgeDTO[] {
    return userWithBadges.badges
      .filter((badge) => badge.badgeType.id === typeId)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  getBadgesForLegend(typeId: number): Badge[] {
    return this.allBadges.filter((b) => b.badgeType.id === typeId);
  }

  getBadgeIconUrl(badge: BadgeDTO | Badge): string {
    if (badge.iconFilename) {
      return `/api/cdn/images/badges/${badge.iconFilename}`;
    }
    return "";
  }

  getUserAvatarUrl(user: User): string {
    if (user.avatarFilename) {
      return `/api/cdn/images/avatar/${user.avatarFilename}`;
    }
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4/PC90ZXh0Pjwvc3ZnPg==";
  }

  getAvatarFrameColor(userWithBadges: UserWithBadges): string {
    const frameType = this.badgeTypes.find((type) => type.isAvatarFrame);
    if (!frameType) {
      return "#f4d03f";
    }

    const frameBadge = userWithBadges.badges.find(
      (badge) => badge.badgeType.id === frameType.id,
    );

    return frameBadge?.color || "#f4d03f";
  }

  // Paginação
  onPageChanged(page: number) {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }

  // Badge Type Modal Methods
  createNewType() {
    this.editingType = null;
    this.typeFormData = {
      name: "",
      description: "",
      isAvatarFrame: false,
      displayOrder: this.badgeTypes.length,
    };
    this.showTypeModal = true;
  }

  editType(type: BadgeType) {
    this.editingType = type;
    this.typeFormData = {
      name: type.name,
      description: type.description || "",
      isAvatarFrame: type.isAvatarFrame,
      displayOrder: type.displayOrder || 0,
    };
    this.showTypeModal = true;
  }

  closeTypeModal() {
    this.showTypeModal = false;
    this.editingType = null;
  }

  saveType() {
    if (this.editingType) {
      this.badgeService
        .updateBadgeType(this.editingType.id, this.typeFormData)
        .subscribe({
          next: () => {
            this.loadData();
            this.closeTypeModal();
          },
          error: (err) => {
            const errorMsg =
              err.error?.error || err.message || "Erro ao atualizar tipo";
            alert(errorMsg);
          },
        });
    } else {
      this.badgeService.createBadgeType(this.typeFormData).subscribe({
        next: () => {
          this.loadData();
          this.closeTypeModal();
        },
        error: (err) => {
          const errorMsg =
            err.error?.error || err.message || "Erro ao criar tipo";
          alert(errorMsg);
        },
      });
    }
  }

  deleteType(type: BadgeType) {
    if (
      confirm(
        `Tem certeza que deseja excluir o tipo "${type.name}"? Isso também excluirá todas as badges deste tipo.`,
      )
    ) {
      this.badgeService.deleteBadgeType(type.id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          alert("Erro ao excluir tipo: " + err.message);
        },
      });
    }
  }

  // Badge Modal Methods
  createNewBadge(type: BadgeType) {
    this.editingBadge = null;
    this.selectedBadgeFile = null;
    this.badgeFormData = {
      name: "",
      description: "",
      badgeTypeId: type.id,
      color: "#f4d03f",
      displayOrder: this.allBadges.length,
    };
    this.showBadgeModal = true;
  }

  editBadge(badge: Badge) {
    this.editingBadge = badge;
    this.selectedBadgeFile = null;
    this.badgeFormData = {
      name: badge.name,
      description: badge.description || "",
      badgeTypeId: badge.badgeType.id,
      color: badge.color || "#f4d03f",
      displayOrder: badge.displayOrder || 0,
    };
    this.showBadgeModal = true;
  }

  closeBadgeModal() {
    this.showBadgeModal = false;
    this.editingBadge = null;
    this.selectedBadgeFile = null;
  }

  onBadgeFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedBadgeFile = file;
    }
  }

  saveBadge() {
    const saveData = {
      ...this.badgeFormData,
      badgeTypeId: Number(this.badgeFormData.badgeTypeId),
    };

    if (this.editingBadge) {
      this.badgeService.updateBadge(this.editingBadge.id, saveData).subscribe({
        next: (badge) => {
          if (this.selectedBadgeFile) {
            this.uploadBadgeIcon(badge.id);
          } else {
            this.loadData();
            this.closeBadgeModal();
          }
        },
        error: (err) => alert("Erro ao atualizar badge: " + err.message),
      });
    } else {
      this.badgeService.createBadge(saveData).subscribe({
        next: (badge) => {
          if (this.selectedBadgeFile) {
            this.uploadBadgeIcon(badge.id);
          } else {
            this.loadData();
            this.closeBadgeModal();
          }
        },
        error: (err) => alert("Erro ao criar badge: " + err.message),
      });
    }
  }

  uploadBadgeIcon(badgeId: number) {
    if (!this.selectedBadgeFile) return;

    this.badgeService
      .uploadBadgeIcon(badgeId, this.selectedBadgeFile)
      .subscribe({
        next: () => {
          this.loadData();
          this.closeBadgeModal();
        },
        error: (err) => alert("Erro ao fazer upload do ícone: " + err.message),
      });
  }

  deleteBadge(badge: Badge, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (confirm(`Tem certeza que deseja excluir a badge "${badge.name}"?`)) {
      this.badgeService.deleteBadge(badge.id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          alert("Erro ao excluir badge: " + err.message);
        },
      });
    }
  }

  // Assign Badge Modal Methods
  assignBadgeToUser(user: User) {
    this.assignUser = user;
    this.selectedBadgeForAssign = null;
    this.assignNotes = "";
    this.showAssignModal = true;
  }

  closeAssignModal() {
    this.showAssignModal = false;
    this.assignUser = null;
    this.selectedBadgeForAssign = null;
    this.assignNotes = "";
  }

  selectBadgeForAssign(badge: Badge) {
    if (!this.userHasBadgeInAssign(badge.id)) {
      this.selectedBadgeForAssign = badge;
    }
  }

  userHasBadgeInAssign(badgeId: number): boolean {
    if (!this.assignUser) return false;
    const userWithBadges = this.usersWithBadges.find(
      (u) => u.user.id === this.assignUser!.id,
    );
    return userWithBadges?.badges.some((b) => b.id === badgeId) || false;
  }

  saveAssignBadge() {
    if (!this.assignUser || !this.selectedBadgeForAssign) {
      alert("Selecione uma badge");
      return;
    }

    this.badgeService
      .awardBadge(
        Number(this.assignUser.id),
        Number(this.selectedBadgeForAssign.id),
        this.assignNotes,
      )
      .subscribe({
        next: () => {
          // Atualiza a lista de usuários e mantém o modal aberto
          this.loadUsers();
          // Limpa a seleção para próxima atribuição
          this.selectedBadgeForAssign = null;
          this.assignNotes = "";
        },
        error: (err) => {
          alert(err.error?.error || "Erro ao atribuir badge");
        },
      });
  }

  removeUserBadge(user: User, badge: BadgeDTO) {
    if (
      confirm(
        `Tem certeza que deseja remover a badge "${badge.name}" de ${user.nickname || user.username}?`,
      )
    ) {
      // O ID do BadgeDTO já é o ID do UserBadge (vem do backend assim)
      this.badgeService.revokeBadge(Number(badge.id)).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          alert("Erro ao remover badge: " + err.message);
        },
      });
    }
  }

  // User Settings Modal Methods
  openUserSettings(user: User) {
    this.settingsUser = user;
    this.showUserSettingsModal = true;
  }

  closeUserSettingsModal() {
    this.showUserSettingsModal = false;
    this.settingsUser = null;
  }

  toggleUserAdmin(event: any) {
    if (!this.settingsUser) return;

    const isAdmin = event.target.checked;
    const action = isAdmin ? "conceder" : "remover";
    const role = isAdmin ? "ADMIN" : "USER";

    if (
      confirm(
        `Tem certeza que deseja ${action} privilégios de administrador ${isAdmin ? "para" : "de"} ${this.settingsUser.nickname || this.settingsUser.name}?`,
      )
    ) {
      this.http
        .put(`/api/users/${this.settingsUser.id}/role`, { role })
        .subscribe({
          next: () => {
            if (this.settingsUser) {
              this.settingsUser.role = role as "USER" | "ADMIN";
            }
            this.loadUsers();
          },
          error: (err) => {
            // Reverte o checkbox se der erro
            event.target.checked = !isAdmin;
            alert("Erro ao alterar permissões: " + err.message);
          },
        });
    } else {
      // Reverte o checkbox se cancelar
      event.target.checked = !isAdmin;
    }
  }

  deleteUser(user: User | null) {
    if (!user) return;

    const userName = user.nickname || user.name || user.username;

    if (
      confirm(
        `⚠️ ATENÇÃO: Tem certeza que deseja excluir permanentemente o usuário "${userName}"?\n\nEsta ação não pode ser desfeita e todos os dados do usuário serão removidos.`,
      )
    ) {
      this.http.delete(`/api/users/${user.id}`).subscribe({
        next: () => {
          alert(`Usuário "${userName}" foi excluído com sucesso.`);
          this.closeUserSettingsModal();
          this.loadUsers();
        },
        error: (err) => {
          alert("Erro ao excluir usuário: " + err.message);
        },
      });
    }
  }
}
