import { Routes } from '@angular/router';
import { InicioComponent } from './pages/Inicio/inicio.component';
import { QuemSomosComponent } from './pages/QuemSomos/QuemSomos.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { AccountComponent } from './components/auth/account.component';
import { OAuthCallbackComponent } from './components/auth/oauth-callback.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'quem-somos', component: QuemSomosComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
    { path: 'auth/:provider/callback', component: OAuthCallbackComponent }
];