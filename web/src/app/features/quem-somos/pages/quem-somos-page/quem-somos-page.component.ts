import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-quem-somos-page',
  templateUrl: './quem-somos-page.component.html',
  styleUrls: ['./quem-somos-page.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class QuemSomosPageComponent {
}
