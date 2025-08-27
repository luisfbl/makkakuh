import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {AuthService} from '../core/auth/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // First check if we already have user data
        if (this.authService.isAuthenticated()) {
            return true;
        }

        // If not authenticated locally, verify with API
        return this.authService.verifyAuthentication().pipe(
            map(user => {
                if (user) {
                    return true;
                } else {
                    return this.router.createUrlTree(['/auth/login']);
                }
            }),
            catchError(() => {
                // If API call fails, redirect to login
                return of(this.router.createUrlTree(['/auth/login']));
            })
        );
    }
}