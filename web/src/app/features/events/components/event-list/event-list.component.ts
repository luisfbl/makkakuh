import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Event} from '../../services/events.service';

@Component({
    selector: 'app-event-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.scss']
})
export class EventListComponent {
    @Input() events: Event[] = [];
    @Input() canEdit: boolean = false;
    @Output() eventClicked = new EventEmitter<Event>();

    onEventClick(event: Event) {
        this.eventClicked.emit(event);
    }

    formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getUpcomingEvents(): Event[] {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.events
            .filter(event => new Date(event.date) >= today)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    getPastEvents(): Event[] {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.events
            .filter(event => new Date(event.date) < today)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    getRecurrenceLabel(recurrence: string | undefined): string {
        const recurrenceOptions = {
            'none': 'Sem repetição',
            'daily': 'Diário',
            'weekly': 'Semanal',
            'monthly': 'Mensal'
        };
        return recurrenceOptions[recurrence as keyof typeof recurrenceOptions] || 'Sem repetição';
    }
}