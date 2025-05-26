import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CDNService, UploadProgress } from '../../../core/auth/services/cdn.service';

type UploadVariant = 'avatar' | 'card' | 'compact';
type UploadSize = 'small' | 'medium' | 'large';
type UploadType = 'avatar' | 'honor' | 'banner' | 'gallery';

interface UploadConfig {
    maxSize: number; // em bytes
    allowedTypes: string[];
    dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
    };
}

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class ImageUploadComponent implements OnInit {
    // Configurações visuais
    @Input() variant: UploadVariant = 'card';
    @Input() size: UploadSize = 'medium';
    @Input() buttonText = 'Selecionar Imagem';
    @Input() placeholderText = 'Arraste uma imagem ou clique para selecionar';
    @Input() instructions = 'Arraste e solte uma imagem aqui';
    @Input() showInstructions = true;
    @Input() showProgress = true;
    @Input() allowRemove = true;

    // Configurações de upload
    @Input() type: UploadType = 'avatar';
    @Input() currentImage: string | null = null;
    @Input() uploadConfig: Partial<UploadConfig> = {};

    // Eventos
    @Output() imageUploaded = new EventEmitter<{ url: string, filename: string }>();
    @Output() uploadError = new EventEmitter<string>();
    @Output() imageRemoved = new EventEmitter<void>();
    @Output() uploadStarted = new EventEmitter<File>();
    @Output() uploadProgress = new EventEmitter<number>();

    // Estado interno
    imagePreview: string | ArrayBuffer | null = null;
    progress = 0;
    isUploading = false;
    error: string | null = null;
    successMessage: string | null = null;

    // Configurações padrão por tipo
    private defaultConfigs: Record<UploadType, UploadConfig> = {
        avatar: {
            maxSize: 5 * 1024 * 1024, // 5MB
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        honor: {
            maxSize: 2 * 1024 * 1024, // 2MB
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
        },
        banner: {
            maxSize: 10 * 1024 * 1024, // 10MB
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
            dimensions: { aspectRatio: 16/9 }
        },
        gallery: {
            maxSize: 8 * 1024 * 1024, // 8MB
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        }
    };

    constructor(private cdnService: CDNService) {}

    ngOnInit() {
        if (this.currentImage) {
            this.imagePreview = this.currentImage;
        }
    }

    // Getters para template
    get finalConfig(): UploadConfig {
        return { ...this.defaultConfigs[this.type], ...this.uploadConfig };
    }

    get acceptedTypes(): string {
        return this.finalConfig.allowedTypes.join(',');
    }

    get allowedTypesText(): string {
        return this.finalConfig.allowedTypes
            .map(type => type.split('/')[1].toUpperCase())
            .join(', ');
    }

    get maxSizeText(): string {
        const mb = this.finalConfig.maxSize / (1024 * 1024);
        return `${mb}MB`;
    }

    // Validação de arquivo
    private validateFile(file: File): string | null {
        const config = this.finalConfig;

        // Verificar tipo
        if (!config.allowedTypes.includes(file.type)) {
            return `Tipo de arquivo inválido. Use: ${this.allowedTypesText}`;
        }

        // Verificar tamanho
        if (file.size > config.maxSize) {
            return `Arquivo muito grande. Tamanho máximo: ${this.maxSizeText}`;
        }

        return null;
    }

    // Validação de dimensões (opcional)
    private validateDimensions(file: File): Promise<string | null> {
        return new Promise((resolve) => {
            const config = this.finalConfig;

            if (!config.dimensions) {
                resolve(null);
                return;
            }

            const img = new Image();
            img.onload = () => {
                const { width, height, aspectRatio } = config.dimensions!;

                if (width && img.width !== width) {
                    resolve(`A imagem deve ter ${width}px de largura`);
                    return;
                }

                if (height && img.height !== height) {
                    resolve(`A imagem deve ter ${height}px de altura`);
                    return;
                }

                if (aspectRatio) {
                    const imgRatio = img.width / img.height;
                    const tolerance = 0.1;
                    if (Math.abs(imgRatio - aspectRatio) > tolerance) {
                        resolve(`A imagem deve ter proporção ${aspectRatio}:1`);
                        return;
                    }
                }

                resolve(null);
            };

            img.onerror = () => resolve('Não foi possível carregar a imagem');
            img.src = URL.createObjectURL(file);
        });
    }

    // Event handlers
    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            return;
        }

        this.processFile(input.files[0]);
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        if (event.dataTransfer && event.dataTransfer.files.length > 0) {
            this.processFile(event.dataTransfer.files[0]);
        }
    }

    // Processar arquivo
    private async processFile(file: File) {
        this.clearMessages();

        // Validação básica
        const validationError = this.validateFile(file);
        if (validationError) {
            this.showError(validationError);
            return;
        }

        // Validação de dimensões
        const dimensionError = await this.validateDimensions(file);
        if (dimensionError) {
            this.showError(dimensionError);
            return;
        }

        // Preview e upload
        this.showPreview(file);
        this.uploadFile(file);
    }

    private showPreview(file: File) {
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
    }

    private uploadFile(file: File) {
        this.isUploading = true;
        this.progress = 0;
        this.uploadStarted.emit(file);

        this.cdnService.uploadImage(file, this.type as 'avatar' | 'honor').subscribe({
            next: (progressData: UploadProgress) => {
                this.progress = progressData.progress;
                this.uploadProgress.emit(progressData.progress);

                if (progressData.error) {
                    this.showError(progressData.error);
                    this.isUploading = false;
                }

                if (progressData.completed && progressData.url && progressData.filename) {
                    this.isUploading = false;
                    this.showSuccess('Imagem enviada com sucesso!');

                    this.imageUploaded.emit({
                        url: progressData.url,
                        filename: progressData.filename
                    });
                }
            },
            error: (error) => {
                this.isUploading = false;
                this.showError('Erro no upload da imagem');
                console.error('Upload error:', error);
            }
        });
    }

    removeImage() {
        this.imagePreview = null;
        this.clearMessages();
        this.imageRemoved.emit();
    }

    private showError(message: string) {
        this.error = message;
        this.successMessage = null;
        this.uploadError.emit(message);

        // Limpar erro após 5 segundos
        setTimeout(() => {
            this.error = null;
        }, 5000);
    }

    private showSuccess(message: string) {
        this.successMessage = message;
        this.error = null;

        // Limpar sucesso após 3 segundos
        setTimeout(() => {
            this.successMessage = null;
        }, 3000);
    }

    private clearMessages() {
        this.error = null;
        this.successMessage = null;
    }

    public reset() {
        this.imagePreview = null;
        this.progress = 0;
        this.isUploading = false;
        this.clearMessages();
    }

    public setImage(imageUrl: string) {
        this.imagePreview = imageUrl;
        this.clearMessages();
    }

    get hasImage(): boolean {
        return !!this.imagePreview;
    }

    get canRemove(): boolean {
        return this.allowRemove && this.hasImage && !this.isUploading;
    }

    get isReady(): boolean {
        return !this.isUploading && !this.error;
    }
}