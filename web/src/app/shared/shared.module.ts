import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ImageUploadComponent } from "./components/image-upload/image-upload.component";
import { PageHeaderComponent } from "./components/page-header/page-header.component";
import { SearchBarComponent } from "./components/search-bar/search-bar.component";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { EmptyStateComponent } from "./components/empty-state/empty-state.component";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ImageUploadComponent,
    PageHeaderComponent,
    SearchBarComponent,
    PaginationComponent,
    EmptyStateComponent,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ImageUploadComponent,
    PageHeaderComponent,
    SearchBarComponent,
    PaginationComponent,
    EmptyStateComponent,
  ],
})
export class SharedModule {}
