import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {accountRoutes} from './account.routes';
import {AccountComponent} from './components/account/account.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(accountRoutes),
        AccountComponent
    ]
})
export class AccountModule {
}