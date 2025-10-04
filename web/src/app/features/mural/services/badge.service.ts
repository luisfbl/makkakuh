import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BadgeType } from '../models/badge-type.model';
import { Badge } from '../models/badge.model';
import { UserBadge } from '../models/user-badge.model';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // Badge Types
  getAllBadgeTypes(): Observable<BadgeType[]> {
    return this.http.get<BadgeType[]>(`${this.apiUrl}/badge-types`);
  }

  getBadgeTypeById(id: number): Observable<BadgeType> {
    return this.http.get<BadgeType>(`${this.apiUrl}/badge-types/${id}`);
  }

  createBadgeType(badgeType: Partial<BadgeType>): Observable<BadgeType> {
    return this.http.post<BadgeType>(`${this.apiUrl}/badge-types`, badgeType);
  }

  updateBadgeType(id: number, badgeType: Partial<BadgeType>): Observable<BadgeType> {
    return this.http.put<BadgeType>(`${this.apiUrl}/badge-types/${id}`, badgeType);
  }

  deleteBadgeType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/badge-types/${id}`);
  }

  // Badges
  getAllBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}/badges`);
  }

  getBadgesByType(typeId: number): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}/badges/by-type/${typeId}`);
  }

  getBadgeById(id: number): Observable<Badge> {
    return this.http.get<Badge>(`${this.apiUrl}/badges/${id}`);
  }

  createBadge(badge: Partial<Badge>): Observable<Badge> {
    return this.http.post<Badge>(`${this.apiUrl}/badges`, badge);
  }

  updateBadge(id: number, badge: Partial<Badge>): Observable<Badge> {
    return this.http.put<Badge>(`${this.apiUrl}/badges/${id}`, badge);
  }

  deleteBadge(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/badges/${id}`);
  }

  uploadBadgeIcon(badgeId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/badges/${badgeId}/upload-icon`, formData);
  }

  // User Badges
  getUserBadges(userId: number): Observable<UserBadge[]> {
    return this.http.get<UserBadge[]>(`${this.apiUrl}/user-badges/user/${userId}`);
  }

  getMyBadges(): Observable<UserBadge[]> {
    return this.http.get<UserBadge[]>(`${this.apiUrl}/user-badges/me`);
  }

  getAllUserBadges(): Observable<UserBadge[]> {
    return this.http.get<UserBadge[]>(`${this.apiUrl}/user-badges/all`);
  }

  awardBadge(userId: number, badgeId: number, notes?: string): Observable<UserBadge> {
    return this.http.post<UserBadge>(`${this.apiUrl}/user-badges`, {
      userId,
      badgeId,
      notes
    });
  }

  revokeBadge(userBadgeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user-badges/${userBadgeId}`);
  }
}
