import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';

export interface UploadProgress {
    progress: number;
    completed: boolean;
    url?: string;
    filename?: string;
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CDNService {
    private apiUrl = environment.apiUrl || '/api';

    constructor(private http: HttpClient) {
    }

    uploadImage(file: File, type: 'avatar' | 'honor'): Observable<UploadProgress> {
        if (!file) {
            return of({progress: 0, completed: false, error: 'Nenhum arquivo selecionado'});
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            return of({
                progress: 0,
                completed: false,
                error: 'Tipo de arquivo inválido. Use JPEG, PNG, WebP ou GIF.'
            });
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return of({
                progress: 0,
                completed: false,
                error: 'Arquivo muito grande. Tamanho máximo: 5MB.'
            });
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const req = new HttpRequest('POST', `${this.apiUrl}/cdn/upload`, formData, {
            reportProgress: true
        });

        return this.http.request(req).pipe(
            map((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        const progress = Math.round(100 * (event.loaded / (event.total || event.loaded)));
                        return {
                            progress,
                            completed: false
                        };
                    case HttpEventType.Response:
                        const body = event.body;
                        return {
                            progress: 100,
                            completed: true,
                            url: body.url,
                            filename: body.filename
                        };
                    default:
                        return {
                            progress: 0,
                            completed: false
                        };
                }
            }),
            catchError(error => {
                console.error('Erro no upload:', error);
                let errorMessage = 'Falha no upload da imagem';
                if (error.error && error.error.error) {
                    errorMessage = error.error.error;
                }
                return of({
                    progress: 0,
                    completed: false,
                    error: errorMessage
                });
            })
        );
    }

    getImageUrl(filename: string | null | undefined, type: 'avatar' | 'honor', size?: number): string {
        if (!filename) {
            return this.getDefaultImageUrl(type);
        }

        let url = `${this.apiUrl}/cdn/images/${type}/${filename}`;

        if (type === 'avatar' && size) {
            url += `?size=${size}`;
        }

        return url;
    }

    getDefaultImageUrl(type: 'avatar' | 'honor'): string {
        return `${this.apiUrl}/cdn/images/${type}/default_${type}.png`;
    }

    deleteImage(filename: string, type: 'avatar' | 'honor'): Observable<{ success: boolean, message: string }> {
        return this.http.delete<{
            success: boolean,
            message: string
        }>(`${this.apiUrl}/cdn/images/${type}/${filename}`).pipe(
            catchError(error => {
                console.error('Erro ao excluir imagem:', error);
                let errorMessage = 'Falha ao excluir a imagem';
                if (error.error && error.error.error) {
                    errorMessage = error.error.error;
                }
                return of({success: false, message: errorMessage});
            })
        );
    }
}