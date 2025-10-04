import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  @Input() icon?: string;
  @Input() message: string = 'Nenhum item encontrado';
  @Input() description?: string;
  @Input() actionText?: string;
  @Input() actionRoute?: string;
}
