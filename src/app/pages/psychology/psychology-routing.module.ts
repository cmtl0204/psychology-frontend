import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TestModule} from './test/test.module';
import {ChatModule} from './chat/chat.module';
import {RolesEnum} from '@shared/enums/roles.enum';
import {TokenGuard} from '@shared/guards/token.guard';
import {RoleGuard} from '@shared/guards/role.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./test/test.module').then(m => TestModule),
    data: {
      roles: [RolesEnum.SUPPORT, RolesEnum.VIEWER]
    },
    canActivate: [TokenGuard, RoleGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PsychologyRoutingModule {
}
