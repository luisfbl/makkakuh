import { Routes } from '@angular/router';
import { InicioComponent } from './pages/Inicio/inicio.component';
import { QuemSomosComponent } from './pages/QuemSomos/QuemSomos.component';
import { DashboardComponent } from './pages/Dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'QuemSomos', component: QuemSomosComponent },
    { path: 'Dashboard', component: DashboardComponent }
];