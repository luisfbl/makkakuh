import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { quemSomosRoutes } from "./quem-somos.routes";
import { QuemSomosPageComponent } from "./pages/quem-somos-page/quem-somos-page.component";

@NgModule({
  declarations: [QuemSomosPageComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(quemSomosRoutes)],
})
export class QuemSomosModule {}
