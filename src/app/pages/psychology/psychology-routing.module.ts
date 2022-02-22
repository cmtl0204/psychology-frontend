import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TestModule} from './test/test.module';
import {ChatModule} from './chat/chat.module';
import {RolesEnum} from '@shared/enums/roles.enum';

const routes: Routes = [
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then(m => ChatModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./test/test.module').then(m => TestModule),
    data: {
      roles: [RolesEnum.ADMIN]
    },
    // canActivate: [TokenGuard, RoleGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PsychologyRoutingModule {
}
