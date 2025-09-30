import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EventsService, Event } from "../../services/events.service";

export interface Participant {
  id: number;
  user: {
    id: number;
    name: string;
    nickname: string;
    avatarFilename?: string;
  };
  date: string;
}

export interface ParticipantsResponse {
  subscriptions: Participant[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Component({
  selector: "app-participants-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./participants-list.component.html",
  styleUrls: ["./participants-list.component.scss"],
})
export class ParticipantsListComponent implements OnInit, OnChanges {
  @Input() event: Event | null = null;
  @Input() canEdit: boolean = false;
  @Output() participantRemoved = new EventEmitter<void>();

  participants: Participant[] = [];
  isLoading = false;
  searchTerm = "";
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  hasNext = false;
  hasPrevious = false;

  private searchTimeout: any;

  constructor(private eventsService: EventsService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.event) {
      this.resetPagination();
      this.loadParticipants();
    }
  }

  loadParticipants() {
    if (!this.event?.id) return;

    this.isLoading = true;

    this.eventsService
      .getEventParticipants(
        this.event.id,
        this.currentPage,
        this.pageSize,
        this.searchTerm,
      )
      .subscribe({
        next: (response: ParticipantsResponse) => {
          this.participants = response.subscriptions;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.hasNext = response.hasNext;
          this.hasPrevious = response.hasPrevious;
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Error loading participants:", error);
          this.isLoading = false;
        },
      });
  }

  onSearch() {
    // Debounce search
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.resetPagination();
      this.loadParticipants();
    }, 500);
  }

  clearSearch() {
    this.searchTerm = "";
    this.resetPagination();
    this.loadParticipants();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadParticipants();
  }

  nextPage() {
    if (this.hasNext) {
      this.currentPage++;
      this.loadParticipants();
    }
  }

  previousPage() {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadParticipants();
    }
  }

  removeParticipant(participant: Participant) {
    if (!this.canEdit || !this.event?.id) return;

    if (
      confirm(
        `Tem certeza que deseja remover ${participant.user.name} deste evento?`,
      )
    ) {
      this.eventsService
        .removeParticipant(this.event.id, participant.id)
        .subscribe({
          next: (response) => {
            console.log("Participant removed:", response);
            this.loadParticipants(); // Reload the list
            this.participantRemoved.emit(); // Notify parent component
          },
          error: (error) => {
            console.error("Error removing participant:", error);
            alert("Erro ao remover participante. Tente novamente.");
          },
        });
    }
  }

  private resetPagination() {
    this.currentPage = 0;
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(0, this.currentPage - 2);
    const endPage = Math.min(this.totalPages - 1, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getUserDisplayName(participant: Participant): string {
    return participant.user.name || participant.user.nickname || "Usuário";
  }

  getUserAvatar(participant: Participant): string {
    if (participant.user.avatarFilename) {
      return `/api/cdn/images/avatar/${participant.user.avatarFilename}`;
    }
    // SVG padrão inline
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyNCIgZmlsbD0iIzRBNEE0QSIvPjxwYXRoIGQ9Ik0yNCAyNEM4LjUgMjQgOC41IDI0IDguNSAyNFYzNkM4LjUgNDAgMTEuNSA0MyAxNS41IDQzSDMyLjVDMzYuNSA0MyAzOS41IDQwIDM5LjUgMzZWMjRDMzkuNSAyNCAzOS41IDI0IDI0IDI0WiIgZmlsbD0iI0ZGRDcwMCIvPjxjaXJjbGUgY3g9IjI0IiBjeT0iMTYiIHI9IjgiIGZpbGw9IiNGRkQ3MDAiLz48L3N2Zz4=";
  }

  getEndItem(): number {
    return (this.currentPage + 1) * this.pageSize > this.totalElements
      ? this.totalElements
      : (this.currentPage + 1) * this.pageSize;
  }
}
