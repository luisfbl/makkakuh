import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, throwError, of} from 'rxjs';
import {catchError, map, tap, shareReplay} from 'rxjs/operators';
import {User, UserResponse} from '../models/user.model';
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
    private userSubject = new BehaviorSubject<User | null>(null);
    public user$ = this.userSubject.asObservable();
    private currentUserRequest: Observable<User> | null = null;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    isAuthenticated(): boolean {
        return this.userSubject.value !== null;
    }

    getCurrentUser(): User | null {
        return this.userSubject.value;
    }

    isAdmin(): boolean {
        const user = this.userSubject.value;
        return user?.role === 'ADMIN';
    }

    /**
     * Verifies authentication status by making API call to /api/auth/user
     * This is the primary method to check authentication status
     */
    verifyAuthentication(): Observable<User | null> {
        // Reuse existing request if one is in progress
        if (this.currentUserRequest) {
            return this.currentUserRequest.pipe(
                map(user => user),
                catchError(() => of(null))
            );
        }

        this.currentUserRequest = this.http.get<User>(`${this.apiUrl}/auth/user`)
            .pipe(
                tap(user => {
                    this.userSubject.next(user);
                    this.currentUserRequest = null;
                }),
                catchError(error => {
                    console.log('Not authenticated:', error.status);
                    this.userSubject.next(null);
                    this.currentUserRequest = null;
                    return throwError(() => error);
                }),
                shareReplay(1)
            );

        return this.currentUserRequest.pipe(
            map(user => user),
            catchError(() => of(null))
        );
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
                        this.userSubject.next(response.user);
                    }
                }),
                catchError(error => {
                    console.error('Erro no callback OAuth:', error);
                    return throwError(() => new Error('Falha na autenticação'));
                })
            );
    }

    completeSignUp(userData: Partial<User>): Observable<User> {
        return this.http.post<UserResponse>(`${this.apiUrl}/auth/sign-in`, userData)
            .pipe(
                map(response => response.user),
                tap(user => this.userSubject.next(user)),
                catchError(error => {
                    console.error('Erro ao completar registro:', error);
                    return throwError(() => new Error('Falha ao completar registro'));
                })
            );
    }

    logout(): void {
        this.http.post(`${this.apiUrl}/auth/sign-out`, {}).subscribe({
            next: () => {
                this.userSubject.next(null);
                this.router.navigate(['/']);
            },
            error: (error) => {
                console.error('Erro ao fazer logout:', error);
                // Even if server logout fails, clear client state
                this.userSubject.next(null);
                this.router.navigate(['/']);
            }
        })
    }

    /**
     * Updates the current user data
     */
    updateCurrentUser(user: User): void {
        this.userSubject.next(user);
    }

    /**
     * Forces a refresh of user data from the API
     */
    refreshUser(): Observable<User | null> {
        this.currentUserRequest = null; // Reset any cached request
        return this.verifyAuthentication();
    }
}