import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminModeService {
  private adminModeEnabledSubject = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService) {}

  get isAdminModeEnabled$(): Observable<boolean> {
    return this.adminModeEnabledSubject.asObservable();
  }

  get canAccessAdminMode$(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => user?.role === 'ADMIN')
    );
  }

  get isAdminModeActive$(): Observable<boolean> {
    return combineLatest([
      this.isAdminModeEnabled$,
      this.canAccessAdminMode$
    ]).pipe(
      map(([enabled, canAccess]) => enabled && canAccess)
    );
  }

  toggleAdminMode(): void {
    this.adminModeEnabledSubject.next(!this.adminModeEnabledSubject.value);
  }

  enableAdminMode(): void {
    this.adminModeEnabledSubject.next(true);
  }

  disableAdminMode(): void {
    this.adminModeEnabledSubject.next(false);
  }

  get isAdminModeEnabled(): boolean {
    return this.adminModeEnabledSubject.value;
  }
}