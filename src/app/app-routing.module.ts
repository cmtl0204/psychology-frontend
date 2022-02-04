import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent, BlankComponent} from '@layout/index';
import {RoleGuard} from '@shared/guards/role.guard';
import {RolesEnum} from '@shared/enums/roles.enum';
import {TokenGuard} from '@shared/guards/token.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {path: '', redirectTo: '/', pathMatch: 'full'},
      {
        path: 'user-administration',
        loadChildren: () => import('./pages/core/user-administration/user-administration.module').then(m => m.UserAdministrationModule),
        data: {
          roles: [RolesEnum.ADMIN]
        },
        canActivate: [TokenGuard, RoleGuard]
      },
      {
        path: 'chat',
        loadChildren: () => import('./pages/psychology/psychology.module').then(m => m.PsychologyModule),
        data: {
          roles: [RolesEnum.ADMIN]
        },
        canActivate: [TokenGuard, RoleGuard]
      }
    ]
  },
  {
    path: 'registration',
    component: BlankComponent,
    // loadChildren: () => import('./pages/job-board/registration/registration.module').then(m => m.RegistrationModule)
  },
  {
    path: 'authentication',
    component: BlankComponent,
    loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'common',
    component: BlankComponent,
    loadChildren: () => import('./pages/core/common/common.module').then(m => m.CommonModule)
  },
  {
    path: '**',
    redirectTo: 'common/not-found'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
