import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {quemSomosRoutes} from './quem-somos.routes';
import {QuemSomosPageComponent} from './pages/quem-somos-page/quem-somos-page.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(quemSomosRoutes),
        QuemSomosPageComponent
    ]
})
export class QuemSomosModule {
}