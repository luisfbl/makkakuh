import {Component, Input, Output, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Event, EventsService} from '../../services/events.service';
import {GenericModalComponent, ModalButton} from '../../../../shared/components/generic-modal/generic-modal.component';
import {ParticipantsListComponent} from '../participants-list/participants-list.component';

@Component({
    selector: 'app-event-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, GenericModalComponent, ParticipantsListComponent],
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
    @ViewChild(ParticipantsListComponent) participantsList?: ParticipantsListComponent;

    formData: Event = {
        title: '',
        description: '',
        date: '',
        time: '',
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
        if (this.event?.id) {
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
                this.onParticipantListChanged();
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
                this.onParticipantListChanged();
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

    get modalButtons(): ModalButton[] {
        const buttons: ModalButton[] = [];

        // Botão fechar/cancelar sempre presente
        buttons.push({
            label: this.canEdit ? 'Cancelar' : 'Fechar',
            action: () => this.onClose(),
            classes: 'btn-secondary'
        });

        if (this.canEdit) {
            // Botão deletar (só no modo edição)
            if (this.isEditing && this.event?.id) {
                buttons.push({
                    label: 'Excluir',
                    action: () => this.onDelete(),
                    classes: 'btn-danger',
                    icon: '🗑️'
                });
            }

            // Botão salvar/criar
            buttons.push({
                label: this.isEditing ? 'Salvar' : 'Criar',
                action: () => this.onSave(),
                classes: 'btn-primary',
                disabled: !this.isFormValid(),
                icon: this.isEditing ? '💾' : '➕'
            });
        }

        // Botões de inscrição para usuários
        if (!this.canEdit && this.subscriptionStatus && !this.isLoadingSubscription) {
            if (!this.subscriptionStatus.isAuthenticated) {
                // User not authenticated - show login button
                if (!this.subscriptionStatus.isFull) {
                    buttons.push({
                        label: 'Confirmar Presença',
                        action: () => this.redirectToLogin(),
                        classes: 'btn-success',
                        icon: '✓'
                    });
                }
            } else {
                // User is authenticated
                if (!this.subscriptionStatus.isSubscribed && !this.subscriptionStatus.isFull) {
                    buttons.push({
                        label: 'Confirmar Presença',
                        action: () => this.onSubscribe(),
                        classes: 'btn-success',
                        icon: '✓'
                    });
                }

                if (this.subscriptionStatus.isSubscribed) {
                    buttons.push({
                        label: 'Cancelar Presença',
                        action: () => this.onUnsubscribe(),
                        classes: 'btn-warning',
                        icon: '✗'
                    });
                }
            }
        }

        return buttons;
    }

    getRecurrenceLabel(recurrence: string | undefined): string {
        const option = this.recurrenceOptions.find(opt => opt.value === recurrence);
        return option ? option.label : 'Sem repetição';
    }

    onParticipantRemoved() {
        // Reload subscription status when a participant is removed
        this.loadSubscriptionStatus();
    }

    onParticipantListChanged() {
        // Refresh the participants list when someone subscribes/unsubscribes
        if (this.participantsList) {
            this.participantsList.loadParticipants();
        }
    }

    redirectToLogin() {
        // Redirect to login page - you may need to adjust this path based on your routing
        window.location.href = '/auth/login';
    }
}