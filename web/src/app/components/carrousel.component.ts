import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carrousel',
  standalone: true,
  imports: [CommonModule, NgbCarouselModule],
  templateUrl: './carrousel.component.html'
})
export class CarrouselComponent {
  @Input() images: string[] = [];
}
