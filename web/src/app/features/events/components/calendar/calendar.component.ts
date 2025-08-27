import {Component, Input, Output, EventEmitter, OnInit, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Event} from '../../services/events.service';

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    events: Event[];
    hasEvents: boolean;
}

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {
    @Input() events: Event[] = [];
    @Input() canEdit: boolean = false;
    @Output() eventClicked = new EventEmitter<Event>();

    currentDate = new Date();
    calendarDays: CalendarDay[] = [];
    weekDays: CalendarDay[] = [];
    isMobile = false;
    monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    dayNamesShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    ngOnInit() {
        this.checkMobile();
        this.generateCalendar();

        window.addEventListener('resize', () => {
            this.checkMobile();
            this.generateCalendar();
        });
    }

    ngOnChanges() {
        this.generateCalendar();
    }

    checkMobile() {
        this.isMobile = window.innerWidth < 768;
    }

    generateCalendar() {
        if (this.isMobile) {
            this.generateWeekView();
        } else {
            this.generateMonthView();
        }
    }

    generateMonthView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const endDate = new Date(lastDay);
        const remainingDays = 6 - lastDay.getDay();
        endDate.setDate(endDate.getDate() + remainingDays);

        this.calendarDays = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const dayEvents = this.getEventsForDate(date);

            this.calendarDays.push({
                date: new Date(date),
                isCurrentMonth: date.getMonth() === month,
                isToday: date.getTime() === today.getTime(),
                events: dayEvents,
                hasEvents: dayEvents.length > 0
            });
        }
    }

    generateWeekView() {
        const startOfWeek = new Date(this.currentDate);
        startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());

        this.weekDays = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dayEvents = this.getEventsForDate(date);

            this.weekDays.push({
                date: new Date(date),
                isCurrentMonth: true,
                isToday: date.getTime() === today.getTime(),
                events: dayEvents,
                hasEvents: dayEvents.length > 0
            });
        }
    }

    getEventsForDate(date: Date): Event[] {
        const dateStr = date.toISOString().split('T')[0];
        return this.events.filter(event => event.date === dateStr);
    }

    onDayClick(day: CalendarDay) {
        // Clique no dia não faz mais nada, apenas os eventos são clicáveis
    }

    onEventClick(event: Event, domEvent?: MouseEvent) {
        if (domEvent) {
            domEvent.stopPropagation();
        }
        this.eventClicked.emit(event);
    }

    previousPeriod() {
        if (this.isMobile) {
            this.currentDate.setDate(this.currentDate.getDate() - 7);
        } else {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        }
        this.generateCalendar();
    }

    nextPeriod() {
        if (this.isMobile) {
            this.currentDate.setDate(this.currentDate.getDate() + 7);
        } else {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        }
        this.generateCalendar();
    }

    getCurrentPeriodTitle(): string {
        if (this.isMobile) {
            const startOfWeek = new Date(this.currentDate);
            startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const startDay = startOfWeek.getDate();
            const endDay = endOfWeek.getDate();
            const month = this.monthNames[startOfWeek.getMonth()];
            const year = startOfWeek.getFullYear();

            if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
                return `${startDay} - ${endDay} de ${month} ${year}`;
            } else {
                const endMonth = this.monthNames[endOfWeek.getMonth()];
                return `${startDay} ${month} - ${endDay} ${endMonth} ${year}`;
            }
        } else {
            return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        }
    }
}