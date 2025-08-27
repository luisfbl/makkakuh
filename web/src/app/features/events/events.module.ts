import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { eventsRoutes } from './events.routes';
import { EventsPageComponent } from './pages/events-page/events-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(eventsRoutes),
    EventsPageComponent
  ]
})
export class EventsModule { }