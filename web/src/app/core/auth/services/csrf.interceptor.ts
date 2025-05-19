import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpXsrfTokenExtractor
} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class CSRFInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
            return next.handle(request);
        }

        const csrfToken = this.getCSRFTokenFromHeaders();

        if (csrfToken) {
            request = request.clone({
                headers: request.headers.set('X-CSRF-Token', csrfToken),
                withCredentials: true
            });
        }

        return next.handle(request);
    }

    private getCSRFTokenFromHeaders(): string | null {
        if (document.cookie.includes('makkakuh-csrf-token')) {
            const tokenCookie = document.cookie
                .split(';')
                .map(c => c.trim())
                .find(c => c.startsWith('makkakuh-csrf-token='));

            if (tokenCookie) {
                return tokenCookie.split('=')[1];
            }
        }
        return null;
    }
}