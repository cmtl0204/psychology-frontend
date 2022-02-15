import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestRoutingModule } from './test-routing.module';
import { TestListComponent } from './test-list/test-list.component';
import {TestComponent} from './test.component';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {SharedModule} from '@shared/shared.module';
import {InputTextModule} from 'primeng/inputtext';
import {ReactiveFormsModule} from '@angular/forms';
import {CardModule} from 'primeng/card';
import {PaginatorModule} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import {SplitButtonModule} from 'primeng/splitbutton';
import { AssignmentComponent } from './assignment/assignment.component';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {DividerModule} from 'primeng/divider';



@NgModule({
  declarations: [
    TestComponent,
    TestListComponent,
    AssignmentComponent
  ],
  exports: [

  ],
  imports: [
    CommonModule,
    TestRoutingModule,
    ToolbarModule,
    ButtonModule,
    RippleModule,
    SharedModule,
    InputTextModule,
    ReactiveFormsModule,
    CardModule,
    PaginatorModule,
    TableModule,
    SplitButtonModule,
    ToastModule,
    DialogModule,
    DividerModule
  ]
})
export class TestModule { }
