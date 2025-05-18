import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {User} from '../models/user.model';
import {environment} from '../../../../environments/environment';

interface OAuthCallbackResponseType {
    isNewUser: boolean;
    user?: User;
    userProfile?: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl || '/api';
    private loggedIn = false;
    private user: User | null = null;
    private userDataKey = 'makkakuh_user_data';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        const storedUser = localStorage.getItem(this.userDataKey);
        if (storedUser) {
            try {
                this.user = JSON.parse(storedUser);
                this.loggedIn = true;
            } catch (e) {
                localStorage.removeItem(this.userDataKey);
            }
        }
    }

    isAuthenticated(): boolean {
        return this.loggedIn;
    }

    getCurrentUser(): User | null {
        return this.user;
    }

    initiateOAuth(provider: string): Observable<string> {
        return this.http.get<{ url: string }>(`${this.apiUrl}/auth/oauth/${provider}`, {})
            .pipe(
                map(response => response.url),
                catchError(error => {
                    console.error('Erro ao iniciar o fluxo OAuth:', error);
                    return throwError(() => new Error('Falha ao iniciar autenticação'));
                })
            );
    }

    redirectToOAuthProvider(url: string): void {
        window.location.href = url;
    }

    handleOAuthCallback(provider: string, code: string, state: string): Observable<OAuthCallbackResponseType> {
        return this.http.get<OAuthCallbackResponseType>(`${this.apiUrl}/auth/${provider}/callback?code=${code}&state=${state}`)
            .pipe(
                tap((response: OAuthCallbackResponseType) => {
                    if (!response.isNewUser && response.user) {
                        this.setAuthenticated(response.user);
                    }
                }),
                catchError(error => {
                    console.error('Erro no callback OAuth:', error);
                    return throwError(() => new Error('Falha na autenticação'));
                })
            );
    }

    completeSignUp(userData: Partial<User>): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/auth/sign-in`, userData)
            .pipe(
                tap(user => this.setAuthenticated(user)),
                catchError(error => {
                    console.error('Erro ao completar registro:', error);
                    return throwError(() => new Error('Falha ao completar registro'));
                })
            );
    }

    logout(): void {
        this.http.post(`${this.apiUrl}/auth/sign-out`, {}).subscribe({
            next: () => {
                this.clearUserData();
                this.router.navigate(['/']);
            },
            error: (error) => {
                console.error('Erro ao fazer logout:', error);

                this.clearUserData();
                this.router.navigate(['/']);
            }
        })
    }

    setAuthenticated(user: User): void {
        this.user = user;
        this.loggedIn = true;
        localStorage.setItem(this.userDataKey, JSON.stringify(user));
    }

    clearUserData(): void {
        this.user = null;
        this.loggedIn = false;
        localStorage.removeItem(this.userDataKey);
    }
}