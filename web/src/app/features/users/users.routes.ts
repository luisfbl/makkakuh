import {Routes} from '@angular/router';
import {UsersMePageComponent} from "./pages/@me/users-me-page.component";
import {AuthGuard} from "../../guards/auth.guard";

export const usersRoutes: Routes = [
    {path: '@me', component: UsersMePageComponent, canActivate: [AuthGuard]}
];