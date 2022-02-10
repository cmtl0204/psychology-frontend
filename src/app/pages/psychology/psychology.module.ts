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
import { QuestionComponent } from './chat/question/question.component';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {PanelModule} from 'primeng/panel';
import {ProgressBarModule} from 'primeng/progressbar';
import {AvatarModule} from 'primeng/avatar';
import {BadgeModule} from 'primeng/badge';
import {RegistrationComponent} from './chat/registration/registration.component';
import { ChatComponent } from './chat/chat.component';
import {InputNumberModule} from 'primeng/inputnumber';
import {MessageModule} from 'primeng/message';
import {MessagesModule} from 'primeng/messages';
import {DropdownModule} from 'primeng/dropdown';
import {KeyFilterModule} from 'primeng/keyfilter';
import {RegistrationAgentComponent} from './chat/registration-agent/registration-agent.component';
import {RegistrationPatientComponent} from './chat/registration-patient/registration-patient.component';

@NgModule({
  declarations: [
    QuestionComponent,
    RegistrationComponent,
    RegistrationAgentComponent,
    RegistrationPatientComponent,
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
        AvatarModule,
        BadgeModule,
        InputNumberModule,
        MessageModule,
        MessagesModule,
        DropdownModule,
        KeyFilterModule
    ]
})
export class PsychologyModule {
}
