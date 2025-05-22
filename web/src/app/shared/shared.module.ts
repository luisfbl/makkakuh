import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ImageUploadComponent} from './components/image-upload/image-upload.component';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        ImageUploadComponent
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        ImageUploadComponent
    ]
})
export class SharedModule {
}