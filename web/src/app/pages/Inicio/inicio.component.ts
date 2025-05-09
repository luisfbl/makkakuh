import { Component } from '@angular/core';
import { CarrouselComponent } from '../../components/carrousel.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CarrouselComponent],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  carrouselImages = [
    'assets/img1.png'
  ];
}
