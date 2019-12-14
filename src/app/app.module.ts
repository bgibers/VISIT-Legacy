import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpBackend, HttpXhrBackend } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from '../app/ionic-native-http-connection-backend';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SelectedLocationPage } from './modals/selected-location/selected-location.page';
import { ApiModule } from './backend/client';
import { Platform } from '@ionic/angular';

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
      NativeHttpModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: HttpBackend, useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend]}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
