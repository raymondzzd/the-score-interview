import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RushingComponent } from './rushing/rushing.component';

const routes: Routes = [
  {
    path: 'rushing',
    component: RushingComponent
  }, {
    path: '**',
    redirectTo: 'rushing'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
