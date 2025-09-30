import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Event } from "../../services/events.service";

@Component({
  selector: "app-event-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./event-list.component.html",
  styleUrls: ["./event-list.component.scss"],
})
export class EventListComponent {
  @Input() events: Event[] = [];
  @Input() canEdit: boolean = false;
  @Output() eventClicked = new EventEmitter<Event>();

  currentPageUpcoming = 0;
  currentPagePast = 0;
  pageSize = 6;

  onEventClick(event: Event) {
    this.eventClicked.emit(event);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  getUpcomingEvents(): Event[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.events
      .filter((event) => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getPastEvents(): Event[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.events
      .filter((event) => new Date(event.date) < today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getRecurrenceLabel(recurrence: string | undefined): string {
    const recurrenceOptions = {
      none: "Sem repetição",
      daily: "Diário",
      weekly: "Semanal",
      monthly: "Mensal",
    };
    return (
      recurrenceOptions[recurrence as keyof typeof recurrenceOptions] ||
      "Sem repetição"
    );
  }

  getPaginatedUpcomingEvents(): Event[] {
    const allUpcoming = this.getUpcomingEvents();
    const startIndex = this.currentPageUpcoming * this.pageSize;
    return allUpcoming.slice(startIndex, startIndex + this.pageSize);
  }

  getPaginatedPastEvents(): Event[] {
    const allPast = this.getPastEvents();
    const startIndex = this.currentPagePast * this.pageSize;
    return allPast.slice(startIndex, startIndex + this.pageSize);
  }

  getTotalPagesUpcoming(): number {
    return Math.ceil(this.getUpcomingEvents().length / this.pageSize);
  }

  getTotalPagesPast(): number {
    return Math.ceil(this.getPastEvents().length / this.pageSize);
  }

  nextPageUpcoming(): void {
    if (this.currentPageUpcoming < this.getTotalPagesUpcoming() - 1) {
      this.currentPageUpcoming++;
    }
  }

  previousPageUpcoming(): void {
    if (this.currentPageUpcoming > 0) {
      this.currentPageUpcoming--;
    }
  }

  nextPagePast(): void {
    if (this.currentPagePast < this.getTotalPagesPast() - 1) {
      this.currentPagePast++;
    }
  }

  previousPagePast(): void {
    if (this.currentPagePast > 0) {
      this.currentPagePast--;
    }
  }

  goToPageUpcoming(page: number): void {
    this.currentPageUpcoming = page;
  }

  goToPagePast(page: number): void {
    this.currentPagePast = page;
  }

  getPageNumbers(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i);
  }
}
