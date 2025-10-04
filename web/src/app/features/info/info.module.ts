import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";

import { LeisRegrasPageComponent } from "./pages/leis-regras-page/leis-regras-page.component";
import { OrganizacaoPageComponent } from "./pages/organizacao-page/organizacao-page.component";
import { GlossarioPageComponent } from "./pages/glossario-page/glossario-page.component";
import { FaqPageComponent } from "./pages/faq-page/faq-page.component";
import { HierarquiaPageComponent } from "./pages/hierarquia-page/hierarquia-page.component";
import { RegrasMassivaPageComponent } from "./pages/regras-massiva-page/regras-massiva-page.component";
import { RegrasDueloPageComponent } from "./pages/regras-duelo-page/regras-duelo-page.component";
import { ComiteFemininoPageComponent } from "./pages/comite-feminino-page/comite-feminino-page.component";
import { EquipamentosPageComponent } from "./pages/equipamentos-page/equipamentos-page.component";
import { OQueELarpPageComponent } from "./pages/o-que-e-larp-page/o-que-e-larp-page.component";
import { OQueESwordplayPageComponent } from "./pages/o-que-e-swordplay-page/o-que-e-swordplay-page.component";

const routes = [
  { path: "leis-regras", component: LeisRegrasPageComponent },
  { path: "organizacao", component: OrganizacaoPageComponent },
  { path: "glossario", component: GlossarioPageComponent },
  { path: "faq", component: FaqPageComponent },
  { path: "hierarquia", component: HierarquiaPageComponent },
  { path: "regras-massiva", component: RegrasMassivaPageComponent },
  { path: "regras-duelo", component: RegrasDueloPageComponent },
  { path: "comite-feminino", component: ComiteFemininoPageComponent },
  { path: "equipamentos", component: EquipamentosPageComponent },
  { path: "o-que-e-larp", component: OQueELarpPageComponent },
  { path: "o-que-e-swordplay", component: OQueESwordplayPageComponent },
];

@NgModule({
  declarations: [
    LeisRegrasPageComponent,
    OrganizacaoPageComponent,
    GlossarioPageComponent,
    FaqPageComponent,
    HierarquiaPageComponent,
    RegrasMassivaPageComponent,
    RegrasDueloPageComponent,
    ComiteFemininoPageComponent,
    EquipamentosPageComponent,
    OQueELarpPageComponent,
    OQueESwordplayPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class InfoModule {}
