import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../auth/services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AdminModeService {
  private readonly STORAGE_KEY = "adminModeEnabled";
  private adminModeEnabledSubject = new BehaviorSubject<boolean>(
    this.loadAdminMode(),
  );

  constructor(private authService: AuthService) {}

  private loadAdminMode(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored === "true";
  }

  private saveAdminMode(enabled: boolean): void {
    localStorage.setItem(this.STORAGE_KEY, enabled.toString());
  }

  get isAdminModeEnabled$(): Observable<boolean> {
    return this.adminModeEnabledSubject.asObservable();
  }

  get canAccessAdminMode$(): Observable<boolean> {
    return this.authService.user$.pipe(map((user) => user?.role === "ADMIN"));
  }

  get isAdminModeActive$(): Observable<boolean> {
    return combineLatest([
      this.isAdminModeEnabled$,
      this.canAccessAdminMode$,
    ]).pipe(map(([enabled, canAccess]) => enabled && canAccess));
  }

  toggleAdminMode(): void {
    const newValue = !this.adminModeEnabledSubject.value;
    this.saveAdminMode(newValue);
    this.adminModeEnabledSubject.next(newValue);
  }

  enableAdminMode(): void {
    this.saveAdminMode(true);
    this.adminModeEnabledSubject.next(true);
  }

  disableAdminMode(): void {
    this.saveAdminMode(false);
    this.adminModeEnabledSubject.next(false);
  }

  get isAdminModeEnabled(): boolean {
    return this.adminModeEnabledSubject.value;
  }
}
