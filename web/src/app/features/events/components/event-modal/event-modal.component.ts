import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Event, EventsService} from '../../services/events.service';

@Component({
    selector: 'app-event-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './event-modal.component.html',
    styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent implements OnInit {
    @Input() event: Event | null = null;
    @Input() isEditing: boolean = false;
    @Input() canEdit: boolean = false;
    @Input() defaultDate: Date | null = null;
    @Output() eventSaved = new EventEmitter<Event>();
    @Output() eventDeleted = new EventEmitter<number>();
    @Output() modalClosed = new EventEmitter<void>();

    formData: Event = {
        title: '',
        description: '',
        date: '',
        place: '',
        maxParticipants: null,
        recurrence: 'none'
    };

    recurrenceOptions = [
        {value: 'none', label: 'Sem repetição'},
        {value: 'daily', label: 'Diário'},
        {value: 'weekly', label: 'Semanal'},
        {value: 'monthly', label: 'Mensal'}
    ];

    // Subscription related
    subscriptionStatus: any = null;
    isLoadingSubscription = false;

    constructor(private eventsService: EventsService) {}

    ngOnInit() {
        if (this.event) {
            this.formData = {...this.event};
            this.loadSubscriptionStatus();
        } else if (this.defaultDate) {
            this.formData.date = this.defaultDate.toISOString().split('T')[0];
        }
    }

    loadSubscriptionStatus() {
        if (this.event?.id && !this.canEdit) {
            this.isLoadingSubscription = true;
            this.eventsService.getSubscriptionStatus(this.event.id).subscribe({
                next: (status) => {
                    this.subscriptionStatus = status;
                    this.isLoadingSubscription = false;
                },
                error: (error) => {
                    console.error('Error loading subscription status:', error);
                    this.isLoadingSubscription = false;
                }
            });
        }
    }

    onSubscribe() {
        if (!this.event?.id) return;
        
        this.isLoadingSubscription = true;
        this.eventsService.subscribeToEvent(this.event.id).subscribe({
            next: (response) => {
                console.log('Subscribed successfully:', response);
                this.loadSubscriptionStatus();
            },
            error: (error) => {
                console.error('Error subscribing:', error);
                this.isLoadingSubscription = false;
                alert('Erro ao se inscrever no evento. ' + (error.error?.error || 'Tente novamente.'));
            }
        });
    }

    onUnsubscribe() {
        if (!this.event?.id) return;
        
        if (!confirm('Tem certeza que deseja cancelar sua inscrição?')) return;
        
        this.isLoadingSubscription = true;
        this.eventsService.unsubscribeFromEvent(this.event.id).subscribe({
            next: (response) => {
                console.log('Unsubscribed successfully:', response);
                this.loadSubscriptionStatus();
            },
            error: (error) => {
                console.error('Error unsubscribing:', error);
                this.isLoadingSubscription = false;
                alert('Erro ao cancelar inscrição. Tente novamente.');
            }
        });
    }

    onSave() {
        if (!this.canEdit) return;

        if (this.isFormValid()) {
            this.eventSaved.emit(this.formData);
        }
    }

    onDelete() {
        if (!this.canEdit || !this.event?.id) return;

        if (confirm('Tem certeza que deseja excluir este evento?')) {
            this.eventDeleted.emit(this.event.id);
        }
    }

    onClose() {
        this.modalClosed.emit();
    }

    onBackdropClick(event: MouseEvent) {
        if ((event.target as Element).classList.contains('modal-backdrop')) {
            this.onClose();
        }
    }

    isFormValid(): boolean {
        return !!(
            this.formData.title.trim() &&
            this.formData.description.trim() &&
            this.formData.date &&
            this.formData.place.trim()
        );
    }

    get modalTitle(): string {
        if (!this.canEdit) return 'Detalhes do Evento';
        return this.isEditing ? 'Editar Evento' : 'Novo Evento';
    }

    getRecurrenceLabel(recurrence: string | undefined): string {
        const option = this.recurrenceOptions.find(opt => opt.value === recurrence);
        return option ? option.label : 'Sem repetição';
    }
}