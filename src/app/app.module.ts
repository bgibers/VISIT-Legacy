import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpBackend, HttpXhrBackend } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpConfigInterceptor } from './backend/client/httpConfigInterceptor';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NativeHttpModule } from '../app/ionic-native-http-connection-backend';
import { SelectedLocationPage } from './modals/selected-location/selected-location.page';
import { ApiModule, UserService } from './backend/client';
import { AuthGuard } from './backend/services/AuthGuard.service';
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
    AuthGuard,
    UserService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
