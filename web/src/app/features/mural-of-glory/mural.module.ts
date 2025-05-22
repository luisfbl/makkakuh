import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { muralRoutes } from './mural.routes';
import { CDNService } from '../../core/auth/services/cdn.service';

@NgModule({
  imports: [
    RouterModule.forChild(muralRoutes)
  ],
  providers: [
    CDNService
  ]
})
export class MuralModule { }