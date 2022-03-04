import {NgModule,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
//PrimeNg Modules
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {DividerModule} from "primeng/divider";
import {FileUploadModule} from "primeng/fileupload";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputTextModule} from "primeng/inputtext";
import {MessageModule} from "primeng/message";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {PaginatorModule} from "primeng/paginator";
import {ProgressBarModule} from "primeng/progressbar";
import {RippleModule} from "primeng/ripple";
import {SkeletonModule} from 'primeng/skeleton';
import {TableModule} from 'primeng/table';
import {ToolbarModule} from "primeng/toolbar";
import {TooltipModule} from "primeng/tooltip";

import {LabelDirective, ErrorMessageDirective, RolesPermissionsDirective, TokenDirective} from '@shared/directives';
import {
  ProgressBarComponent,
  SearchComponent,
  SkeletonComponent,
  UploadFilesComponent,
  ViewFilesComponent
} from '@shared/components';
import {ExtensionsPipe, RolePipe, TermsCondititonsPipe} from "@shared/pipes";

@NgModule({
  declarations: [
    ProgressBarComponent,
    SearchComponent,
    SkeletonComponent,
    UploadFilesComponent,
    ViewFilesComponent,
    ErrorMessageDirective,
    LabelDirective,
    RolesPermissionsDirective,
    TokenDirective,
    ExtensionsPipe,
    RolePipe,
    TermsCondititonsPipe,
  ],
  exports: [
    ProgressBarComponent,
    SearchComponent,
    SkeletonComponent,
    UploadFilesComponent,
    ViewFilesComponent,
    ErrorMessageDirective,
    LabelDirective,
    RolesPermissionsDirective,
    TokenDirective,
    ExtensionsPipe,
    RolePipe,
    TermsCondititonsPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DividerModule,
    FileUploadModule,
    InputTextareaModule,
    InputTextModule,
    MessageModule,
    OverlayPanelModule,
    PaginatorModule,
    ProgressBarModule,
    RippleModule,
    SkeletonModule,
    TableModule,
    ToolbarModule,
    TooltipModule,
  ]
})
export class SharedModule {
}
