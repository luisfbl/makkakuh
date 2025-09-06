import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Honor} from '../../models/honor.model';
import {MuralService} from '../../services/mural.service';
import {CDNService} from '../../../../core/auth/services/cdn.service';
import {ImageUploadComponent} from '../../../../shared/components/image-upload/image-upload.component';
import {GenericModalComponent, ModalButton} from '../../../../shared/components/generic-modal/generic-modal.component';
import {HonorBadgeComponent} from '../honor-badge/honor-badge.component';

@Component({
    selector: 'app-honor-management',
    standalone: true,
    imports: [CommonModule, FormsModule, ImageUploadComponent, GenericModalComponent, HonorBadgeComponent],
    templateUrl: './honor-management.component.html',
    styleUrls: ['./honor-management.component.scss']
})
export class HonorManagementComponent implements OnInit {
    @Input() isAdmin: boolean = false;
    @Output() honorChanged = new EventEmitter<void>();

    honors: Honor[] = [];
    loading = false;
    error: string | null = null;

    // Modal states
    showCreateModal = false;
    showEditModal = false;
    showDeleteModal = false;
    selectedHonor: Honor | null = null;

    // Form data
    formData: Partial<Honor> = {
        name: '',
        icon: '',
        iconFilename: ''
    };

    constructor(
        private muralService: MuralService,
        private cdnService: CDNService
    ) {}

    ngOnInit() {
        this.loadHonors();
    }

    loadHonors() {
        this.loading = true;
        this.error = null;

        this.muralService.getHonors().subscribe({
            next: (honors) => {
                this.honors = honors;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading honors:', error);
                this.error = 'Erro ao carregar badges';
                this.loading = false;
            }
        });
    }

    openCreateModal() {
        this.formData = { name: '', icon: '', iconFilename: '' };
        this.showCreateModal = true;
    }

    openEditModal(honor: Honor) {
        this.selectedHonor = honor;
        this.formData = { ...honor };
        this.showEditModal = true;
    }

    openDeleteModal(honor: Honor) {
        this.selectedHonor = honor;
        this.showDeleteModal = true;
    }

    closeModals() {
        this.showCreateModal = false;
        this.showEditModal = false;
        this.showDeleteModal = false;
        this.selectedHonor = null;
        this.formData = { name: '', icon: '', iconFilename: '' };
    }

    onCreateHonor() {
        if (!this.formData.name?.trim()) {
            this.error = 'Nome é obrigatório';
            return;
        }

        this.loading = true;
        this.muralService.createHonor(this.formData).subscribe({
            next: (honor) => {
                this.honors.push(honor);
                this.closeModals();
                this.loading = false;
                this.honorChanged.emit();
            },
            error: (error) => {
                console.error('Error creating honor:', error);
                this.error = 'Erro ao criar badge';
                this.loading = false;
            }
        });
    }

    onUpdateHonor() {
        if (!this.selectedHonor?.id || !this.formData.name?.trim()) {
            this.error = 'Dados inválidos';
            return;
        }

        this.loading = true;
        this.muralService.updateHonor(this.selectedHonor.id, this.formData).subscribe({
            next: (honor) => {
                const index = this.honors.findIndex(h => h.id === honor.id);
                if (index !== -1) {
                    this.honors[index] = honor;
                }
                this.closeModals();
                this.loading = false;
                this.honorChanged.emit();
            },
            error: (error) => {
                console.error('Error updating honor:', error);
                this.error = 'Erro ao atualizar badge';
                this.loading = false;
            }
        });
    }

    onDeleteHonor() {
        if (!this.selectedHonor?.id) {
            return;
        }

        this.loading = true;
        this.muralService.deleteHonor(this.selectedHonor.id).subscribe({
            next: () => {
                this.honors = this.honors.filter(h => h.id !== this.selectedHonor!.id);
                this.closeModals();
                this.loading = false;
                this.honorChanged.emit();
            },
            error: (error) => {
                console.error('Error deleting honor:', error);
                this.error = 'Erro ao excluir badge';
                this.loading = false;
            }
        });
    }

    onImageSelected(file: File) {
        if (!this.selectedHonor?.id) {
            // For create mode, just store the file reference
            this.formData.icon = file.name;
            return;
        }

        // For edit mode, upload immediately
        this.muralService.uploadHonorIcon(this.selectedHonor.id, file).subscribe({
            next: (response) => {
                this.formData.iconFilename = response.filename;
                if (this.selectedHonor) {
                    this.selectedHonor.iconFilename = response.filename;
                }
            },
            error: (error) => {
                console.error('Error uploading image:', error);
                this.error = 'Erro ao fazer upload da imagem';
            }
        });
    }

    get createModalButtons(): ModalButton[] {
        return [
            {
                label: 'Cancelar',
                action: () => this.closeModals(),
                classes: 'btn-secondary'
            },
            {
                label: 'Criar',
                action: () => this.onCreateHonor(),
                classes: 'btn-primary',
                disabled: !this.formData.name?.trim() || this.loading,
                icon: '➕'
            }
        ];
    }

    get editModalButtons(): ModalButton[] {
        return [
            {
                label: 'Cancelar',
                action: () => this.closeModals(),
                classes: 'btn-secondary'
            },
            {
                label: 'Salvar',
                action: () => this.onUpdateHonor(),
                classes: 'btn-primary',
                disabled: !this.formData.name?.trim() || this.loading,
                icon: '💾'
            }
        ];
    }

    get deleteModalButtons(): ModalButton[] {
        return [
            {
                label: 'Cancelar',
                action: () => this.closeModals(),
                classes: 'btn-secondary'
            },
            {
                label: 'Excluir',
                action: () => this.onDeleteHonor(),
                classes: 'btn-danger',
                disabled: this.loading,
                icon: '🗑️'
            }
        ];
    }
}