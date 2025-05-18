import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/auth/guards/auth.guard';
import {AccountComponent} from "./components/account/account.component";

export const accountRoutes: Routes = [
  { path: '', component: AccountComponent, canActivate: [AuthGuard] }
];