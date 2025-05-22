import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {dashboardRoutes} from './dashboard.routes';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {ImageUploadComponent} from '../../shared/components/image-upload/image-upload.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(dashboardRoutes),
        DashboardComponent,
        ImageUploadComponent
    ]
})
export class DashboardModule {
}