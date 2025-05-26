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
        path: 'users',
        loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule)
    },
    {
        path: 'quem-somos',
        loadChildren: () => import('./features/quem-somos/quem-somos.module').then(m => m.QuemSomosModule)
    },
    {
        path: 'mural-da-gloria',
        loadChildren: () => import('./features/mural-of-glory/mural.module').then(m => m.MuralModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}