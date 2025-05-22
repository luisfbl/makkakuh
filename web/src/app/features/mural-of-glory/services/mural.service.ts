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
}