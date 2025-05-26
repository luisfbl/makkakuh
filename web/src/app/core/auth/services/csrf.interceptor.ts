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
        // Always clone the request with withCredentials true to send cookies with every request
        // This is crucial for authentication via cookies
        const updatedRequest = request.clone({
            withCredentials: true
        });
        
        // For mutation requests (not GET/HEAD/OPTIONS), add the CSRF token
        if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
            const csrfToken = this.getCSRFTokenFromHeaders();

            if (csrfToken) {
                return next.handle(updatedRequest.clone({
                    headers: updatedRequest.headers.set('X-CSRF-Token', csrfToken)
                }));
            }
        }

        return next.handle(updatedRequest);
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