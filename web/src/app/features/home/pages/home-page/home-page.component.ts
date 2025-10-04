import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { EventsService, Event } from "../../../events/services/events.service";
import { EventModalComponent } from "../../../events/components/event-modal/event-modal.component";
import { EmptyStateComponent } from "../../../../shared/components/empty-state/empty-state.component";
import { LoadingComponent } from "../../../../shared/components/loading.component";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EventModalComponent,
    EmptyStateComponent,
    LoadingComponent,
  ],
})
export class HomePageComponent implements OnInit {
  upcomingEvents: Event[] = [];
  isLoading = false;
  showEventModal = false;
  selectedEvent: Event | null = null;

  constructor(private eventsService: EventsService) {}

  ngOnInit() {
    this.loadUpcomingEvents();
  }

  loadUpcomingEvents() {
    this.isLoading = true;
    this.eventsService.getUpcomingEvents().subscribe({
      next: (events) => {
        this.upcomingEvents = events.slice(0, 4);
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading events:", error);
        this.isLoading = false;
      },
    });
  }

  onEventClick(event: Event) {
    this.selectedEvent = event;
    this.showEventModal = true;
  }

  onModalClosed() {
    this.showEventModal = false;
    this.selectedEvent = null;
  }
}
