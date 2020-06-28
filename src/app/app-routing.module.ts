import { SplashComponent } from './pages/splash/splash.component';
import { BingoComponent } from './pages/bingo/bingo.component';
import { HomeComponent } from './pages/home/home.component';
import { HomeBingoComponent } from './pages/home-bingo/home-bingo.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:'home', component:HomeBingoComponent},
  {path:'user', component:HomeComponent},
  {path:'bingo/:room', component:BingoComponent},
  {path: '', component:SplashComponent},
  {path: '**', redirectTo:'', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
