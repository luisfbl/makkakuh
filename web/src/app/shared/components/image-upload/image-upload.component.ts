import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CDNService, UploadProgress} from '../../../core/auth/services/cdn.service';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class ImageUploadComponent {
    @Input() type: 'avatar' | 'honor' = 'avatar';
    @Input() currentImage: string | null = null;
    @Input() buttonText = 'Selecionar Imagem';
    @Input() placeholderText = 'Nenhuma imagem selecionada';

    @Output() imageUploaded = new EventEmitter<{ url: string, filename: string }>();
    @Output() uploadError = new EventEmitter<string>();

    imagePreview: string | ArrayBuffer | null = null;
    progress = 0;
    isUploading = false;
    error: string | null = null;

    constructor(private cdnService: CDNService) {
    }

    ngOnInit() {
        if (this.currentImage) {
            this.imagePreview = this.currentImage;
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            return;
        }

        const file = input.files[0];

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            this.error = 'Tipo de arquivo inválido. Use JPEG, PNG, WebP ou GIF.';
            this.uploadError.emit(this.error);
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            this.error = 'Arquivo muito grande. Tamanho máximo: 5MB.';
            this.uploadError.emit(this.error);
            return;
        }

        this.showPreview(file);
        this.uploadFile(file);
    }

    showPreview(file: File) {
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
    }

    uploadFile(file: File) {
        this.isUploading = true;
        this.progress = 0;
        this.error = null;

        this.cdnService.uploadImage(file, this.type).subscribe((progressData: UploadProgress) => {
            this.progress = progressData.progress;

            if (progressData.error) {
                this.error = progressData.error;
                this.isUploading = false;
                this.uploadError.emit(progressData.error);
            }

            if (progressData.completed && progressData.url && progressData.filename) {
                this.isUploading = false;
                this.imageUploaded.emit({
                    url: progressData.url,
                    filename: progressData.filename
                });
            }
        });
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        if (event.dataTransfer && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];

            const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                this.error = 'Tipo de arquivo inválido. Use JPEG, PNG, WebP ou GIF.';
                this.uploadError.emit(this.error);
                return;
            }

            this.showPreview(file);
            this.uploadFile(file);
        }
    }
}