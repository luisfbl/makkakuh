import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {dashboardRoutes} from './dashboardRoutes';
import {DashboardComponent} from './components/dashboard/dashboard.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(dashboardRoutes),
        DashboardComponent
    ]
})
export class DashboardModule {
}