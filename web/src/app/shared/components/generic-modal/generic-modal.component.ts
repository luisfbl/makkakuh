import {Component, Input, Output, EventEmitter, TemplateRef, ContentChild} from '@angular/core';
import {CommonModule} from '@angular/common';

export interface ModalButton {
  label: string;
  action: () => void;
  classes?: string;
  disabled?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-generic-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss']
})
export class GenericModalComponent {
  @Input() title: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showCloseButton: boolean = true;
  @Input() closeOnBackdropClick: boolean = true;
  @Input() buttons: ModalButton[] = [];
  @Input() isVisible: boolean = true;

  @Output() modalClosed = new EventEmitter<void>();

  @ContentChild('modalBody', { static: false }) modalBodyTemplate!: TemplateRef<any>;
  @ContentChild('modalHeader', { static: false }) modalHeaderTemplate!: TemplateRef<any>;
  @ContentChild('modalFooter', { static: false }) modalFooterTemplate!: TemplateRef<any>;

  onClose() {
    this.modalClosed.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (this.closeOnBackdropClick && (event.target as Element).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }

  executeButtonAction(button: ModalButton) {
    if (!button.disabled) {
      button.action();
    }
  }

  get modalSizeClass(): string {
    switch (this.size) {
      case 'small':
        return 'modal-small';
      case 'large':
        return 'modal-large';
      default:
        return 'modal-medium';
    }
  }
}