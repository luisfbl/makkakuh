import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'quem-somos',
        loadChildren: () => import('./features/quem-somos/quem-somos.module').then(m => m.QuemSomosModule)
    },
    {path: 'login', redirectTo: 'auth/login', pathMatch: 'full'},
    {path: 'register', redirectTo: 'auth/register', pathMatch: 'full'},
    {path: 'QuemSomos', redirectTo: 'quem-somos', pathMatch: 'full'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}