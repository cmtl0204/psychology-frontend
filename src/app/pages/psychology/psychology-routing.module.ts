import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from './chat/chat.component';
import {TestModule} from './test/test.module';

const routes: Routes = [
  {path: '', component: ChatComponent},
  {
    path: 'dashboard',
    loadChildren: () => import('./test/test.module').then(m => TestModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PsychologyRoutingModule {
}
