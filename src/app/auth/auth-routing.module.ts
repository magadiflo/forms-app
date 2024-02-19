import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { InscriptionPageComponent } from './pages/inscription-page/inscription-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'register', component: RegisterPageComponent, },
      { path: 'inscription', component: InscriptionPageComponent, },
      { path: '**', redirectTo: 'register', },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
