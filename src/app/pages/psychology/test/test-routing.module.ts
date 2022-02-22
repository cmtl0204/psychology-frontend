import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TestComponent} from './test.component';
import {ResultComponent} from './result/result.component';

const routes: Routes = [
  {path: '', component: TestComponent},
  {path: 'result/:testId', component: ResultComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule {
}
