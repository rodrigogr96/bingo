import { BingoComponent } from './pages/bingo/bingo.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:'user', component:HomeComponent},
  {path:'bingo/:room', component:BingoComponent},
  {path: '', redirectTo:'user', pathMatch: 'full'},
  {path: '**', redirectTo:'user', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
