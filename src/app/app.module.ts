import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BingoComponent } from './pages/bingo/bingo.component';
import { HomeComponent,BottomSheetOverviewExampleSheet } from './pages/home/home.component';
//MATERIAL
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { NgxMaskModule} from 'ngx-mask'
import { OnlynumberStringDirective } from './directives/onlyNumberString.directive'

// const maskConfig: Partial<IConfig> = {
//   validation: false,
// };

@NgModule({
  declarations: [
    AppComponent,
    BingoComponent,
    HomeComponent,
    OnlynumberStringDirective,
    BottomSheetOverviewExampleSheet
  ],
  imports: [
    NgxMaskModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,HttpClientModule
  ],
  entryComponents: [ BottomSheetOverviewExampleSheet ],
  providers: [
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
