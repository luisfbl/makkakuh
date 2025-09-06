import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, forkJoin, map, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {User} from '../../../core/auth/models/user.model';
import {Honor} from '../models/honor.model';
import {UserDetail} from '../models/user-detail.model';
import {UserHonor} from '../models/user-honor.model';
import {MemberProfile} from '../models/member-profile.model';

@Injectable({
    providedIn: 'root'
})
export class MuralService {
    private apiUrl = environment.apiUrl || '/api';

    constructor(private http: HttpClient) {
    }

    getMemberProfiles(page: number, pageSize: number): Observable<{
        profiles: MemberProfile[],
        honors: Honor[],
        pagination: {
            page: number,
            size: number,
            totalItems: number,
            totalPages: number
        }
    }> {
        return this.http.get<any>(`${this.apiUrl}/mural?page=${page}&size=${pageSize}`);
    }

    // Honor/Badge management methods
    getHonors(): Observable<Honor[]> {
        return this.http.get<Honor[]>(`${this.apiUrl}/honors`);
    }

    getHonor(id: string): Observable<Honor> {
        return this.http.get<Honor>(`${this.apiUrl}/honors/${id}`);
    }

    createHonor(honor: Partial<Honor>): Observable<Honor> {
        return this.http.post<Honor>(`${this.apiUrl}/honors`, honor);
    }

    updateHonor(id: string, honor: Partial<Honor>): Observable<Honor> {
        return this.http.put<Honor>(`${this.apiUrl}/honors/${id}`, honor);
    }

    deleteHonor(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/honors/${id}`);
    }

    uploadHonorIcon(honorId: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(`${this.apiUrl}/honors/${honorId}/icon`, formData);
    }
}