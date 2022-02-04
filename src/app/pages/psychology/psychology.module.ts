import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PsychologyRoutingModule} from './psychology-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CardModule} from "primeng/card";
import {SharedModule} from "@shared/shared.module";
import {DividerModule} from "primeng/divider";
import {RippleModule} from "primeng/ripple";
import {PasswordModule} from "primeng/password";
import { ChatComponent } from './chat/chat/chat.component';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {PanelModule} from 'primeng/panel';
import {ProgressBarModule} from 'primeng/progressbar';
import {AvatarModule} from 'primeng/avatar';

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    PsychologyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    SharedModule,
    DividerModule,
    RippleModule,
    PasswordModule,
    ScrollPanelModule,
    PanelModule,
    ProgressBarModule,
    AvatarModule
  ]
})
export class PsychologyModule {
}
