import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading',
    template: `
    <div class="loading-wrapper" [ngClass]="size">
      <div class="spinner" *ngIf="type === 'spinner'"></div>
      
      <div class="dots" *ngIf="type === 'dots'">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      
      <div class="pulse" *ngIf="type === 'pulse'"></div>
      
      <div class="bars" *ngIf="type === 'bars'">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
      
      <span class="loading-text" *ngIf="text && showText">{{ text }}</span>
    </div>
  `,
    styleUrl: './loading.component.scss',
    standalone: true,
    imports: [CommonModule]
})
export class LoadingComponent {
    @Input() type: 'spinner' | 'dots' | 'pulse' | 'bars' = 'spinner';
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() text: string = '';
    @Input() showText: boolean = true;
    @Input() color: 'primary' | 'secondary' | 'white' = 'primary';
}