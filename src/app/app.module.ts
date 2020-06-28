
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BingoComponent } from './pages/bingo/bingo.component';
import { HomeComponent,BottomSheetOverviewExampleSheet } from './pages/home/home.component';
import { SplashComponent } from './pages/splash/splash.component';
import { HomeBingoComponent } from './pages/home-bingo/home-bingo.component';
import { Angular2UsefulSwiperModule } from 'angular2-useful-swiper';
//MATERIAL
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { NgxMaskModule} from 'ngx-mask'
import { OnlynumberStringDirective } from './directives/onlyNumberString.directive'
import { NgxArcTextModule } from 'ngx-arc-text';

// const maskConfig: Partial<IConfig> = {
//   validation: false,
// };

@NgModule({
  declarations: [
    AppComponent,
    BingoComponent,
    HomeComponent,
    OnlynumberStringDirective,
    BottomSheetOverviewExampleSheet,
    SplashComponent,
    HomeBingoComponent
  ],
  imports: [
    NgxMaskModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    Angular2UsefulSwiperModule,
    NgxArcTextModule
  ],
  entryComponents: [ BottomSheetOverviewExampleSheet ],
  providers: [
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
