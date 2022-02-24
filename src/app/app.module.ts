import {NgModule, LOCALE_ID} from '@angular/core';
import localEs from '@angular/common/locales/es';
import {registerLocaleData} from '@angular/common';

registerLocaleData(localEs, 'es');
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpInterceptorProviders} from './interceptors';
import {HttpClientModule} from '@angular/common/http';
// PrimeNg Modules
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {SidebarModule} from 'primeng/sidebar';
import {RippleModule} from 'primeng/ripple';
import {MenubarModule} from 'primeng/menubar';
import {AvatarModule} from 'primeng/avatar';
import {TableModule} from 'primeng/table';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ProgressSpinnerModule} from "primeng/progressspinner";

// Components
import {AppComponent} from './app.component';
import {
  FooterComponent,
  TopbarComponent,
  SidebarComponent,
  BlankComponent,
  MainComponent,
  BreadcrumbComponent
} from '@layout/index';

import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {MessageService} from 'primeng/api';
import {DockModule} from 'primeng/dock';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {TreeModule} from 'primeng/tree';
import {TerminalModule} from 'primeng/terminal';
import {GalleriaModule} from 'primeng/galleria';
import {MenuModule} from 'primeng/menu';

@NgModule({
  declarations: [
    AppComponent,
    BlankComponent,
    MainComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    BreadcrumbComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    AvatarModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    DropdownModule,
    InputSwitchModule,
    InputTextModule,
    TableModule,
    SidebarModule,
    RippleModule,
    MenubarModule,
    PanelMenuModule,
    SharedModule,
    BreadcrumbModule,
    ProgressSpinnerModule,
    DockModule,
    ToastModule,
    DialogModule,
    TreeModule,
    TerminalModule,
    GalleriaModule,
    MenuModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es'},
    MessageService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    HttpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
