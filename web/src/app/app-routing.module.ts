import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./features/home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./features/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "users",
    loadChildren: () =>
      import("./features/users/users.module").then((m) => m.UsersModule),
  },
  {
    path: "quem-somos",
    loadChildren: () =>
      import("./features/quem-somos/quem-somos.module").then(
        (m) => m.QuemSomosModule,
      ),
  },
  {
    path: "mural-da-gloria",
    loadChildren: () =>
      import("./features/mural/mural.routes").then((m) => m.MURAL_ROUTES),
  },
  {
    path: "eventos",
    loadChildren: () =>
      import("./features/events/events.module").then((m) => m.EventsModule),
  },
  {
    path: "info",
    loadChildren: () =>
      import("./features/info/info.module").then((m) => m.InfoModule),
  },
  {
    path: "larp",
    redirectTo: "/info/o-que-e-larp",
    pathMatch: "full",
  },
  {
    path: "swordplay",
    redirectTo: "/info/o-que-e-swordplay",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
