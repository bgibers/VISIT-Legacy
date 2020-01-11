import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, NoPreloading } from '@angular/router';
import { AuthGuard } from './backend/services/AuthGuard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
