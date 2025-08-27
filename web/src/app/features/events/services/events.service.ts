import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';
import {environment} from '../../../../environments/environment';

export interface Event {
    id?: number;
    title: string;
    description: string;
    date: string;
    place: string;
    maxParticipants: number | null;
    recurrence: string;
    subscriptions?: any[];
}

@Injectable({
    providedIn: 'root'
})
export class EventsService {
    private apiUrl = environment.apiUrl || '/api';

    constructor(private http: HttpClient) {}

    getEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}/events`);
    }

    getEvent(id: number): Observable<Event> {
        return this.http.get<Event>(`${this.apiUrl}/events/${id}`);
    }

    createEvent(event: Event): Observable<Event> {
        return this.http.post<Event>(`${this.apiUrl}/events`, event);
    }

    updateEvent(id: number, event: Event): Observable<Event> {
        return this.http.put<Event>(`${this.apiUrl}/events/${id}`, event);
    }

    deleteEvent(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/events/${id}`);
    }

    getUpcomingEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}/events/upcoming`);
    }

    getEventsByDateRange(startDate: string, endDate: string): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}/events/date-range?startDate=${startDate}&endDate=${endDate}`);
    }

    // Subscription methods
    subscribeToEvent(eventId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/events/${eventId}/subscribe`, {});
    }

    unsubscribeFromEvent(eventId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/events/${eventId}/subscribe`);
    }

    getSubscriptionStatus(eventId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/events/${eventId}/subscription-status`);
    }

    getEventSubscriptions(eventId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/events/${eventId}/subscriptions`);
    }

    getMySubscriptions(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/events/my-subscriptions`);
    }
}