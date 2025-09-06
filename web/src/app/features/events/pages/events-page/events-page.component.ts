import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../../core/auth/services/auth.service';
import {AdminModeService} from '../../../../core/admin/admin-mode.service';
import {EventsService, Event} from '../../services/events.service';
import {CalendarComponent} from '../../components/calendar/calendar.component';
import {EventModalComponent} from '../../components/event-modal/event-modal.component';
import {EventListComponent} from '../../components/event-list/event-list.component';

@Component({
    selector: 'app-events-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CalendarComponent,
        EventModalComponent,
        EventListComponent
    ],
    templateUrl: './events-page.component.html',
    styleUrls: ['./events-page.component.scss']
})
export class EventsPageComponent implements OnInit {
    events: Event[] = [];
    showEventModal = false;
    selectedEvent: Event | null = null;
    isEditing = false;
    viewMode: 'calendar' | 'list' = 'calendar';
    defaultEventDate: Date | null = null;

    constructor(
        private authService: AuthService,
        private eventsService: EventsService,
        public adminModeService: AdminModeService
    ) {
    }

    ngOnInit() {
        this.loadEvents();
    }

    loadEvents() {
        this.eventsService.getEvents().subscribe(events => {
            this.events = events;
        });
    }

    get isAdmin(): boolean {
        const user = this.authService.getCurrentUser();
        return user?.role === 'ADMIN' || false;
    }

    onEventClick(event: Event) {
        this.selectedEvent = event;
        this.isEditing = true;
        this.showEventModal = true;
    }

    onDayClick(date: Date) {
        // Cria um novo evento com a data selecionada
        this.selectedEvent = null;
        this.isEditing = false;
        this.defaultEventDate = date;
        
        // Abre o modal de criação de evento
        this.showEventModal = true;
    }

    onCreateEvent() {
        this.selectedEvent = null;
        this.isEditing = false;
        this.showEventModal = true;
    }

    onEventSaved(event: Event) {
        if (this.isEditing && this.selectedEvent?.id) {
            this.eventsService.updateEvent(this.selectedEvent.id, event).subscribe(() => {
                this.loadEvents();
            });
        } else {
            this.eventsService.createEvent(event).subscribe(() => {
                this.loadEvents();
            });
        }
        this.showEventModal = false;
    }

    onEventDeleted(eventId: number) {
        this.eventsService.deleteEvent(eventId).subscribe(() => {
            this.loadEvents();
        });
        this.showEventModal = false;
    }

    onModalClosed() {
        this.showEventModal = false;
        this.selectedEvent = null;
        this.defaultEventDate = null;
    }

    toggleViewMode() {
        this.viewMode = this.viewMode === 'calendar' ? 'list' : 'calendar';
    }
}