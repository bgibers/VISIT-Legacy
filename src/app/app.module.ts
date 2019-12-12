import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SelectedLocationPage } from './modals/selected-location/selected-location.page';
import { ApiModule } from './backend/client';
@NgModule({
  declarations: [
    AppComponent,
    SelectedLocationPage
  ],
  entryComponents: [SelectedLocationPage],
  imports: [
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      ApiModule,
      HttpClientModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
