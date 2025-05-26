import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {usersRoutes} from "./users.routes";
import {UsersMePageComponent} from "./pages/@me/users-me-page.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(usersRoutes),
        UsersMePageComponent
    ]
})
export class UsersModule {
}