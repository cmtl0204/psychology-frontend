import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RolesEnum} from '@shared/enums';
import {RoleGuard, TokenGuard} from '@shared/guards';
import {UserAdministrationComponent} from './user-administration.component';
import {UserAdministrationFormComponent} from './user-administration-form/user-administration-form.component';

const routes: Routes = [
  {
    path: '',
    component: UserAdministrationComponent,
    children: [],
    data: {
      roles: [RolesEnum.ADMIN]
    },
    canActivate: [TokenGuard, RoleGuard]
  },
  {
    path: 'form/:id',
    component: UserAdministrationFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAdministrationRoutingModule {
}
