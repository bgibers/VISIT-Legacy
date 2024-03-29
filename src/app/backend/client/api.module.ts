import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


import { LocationService } from './api/location.service';
import { UserService } from './api/user.service';
import { UserLocationService } from './api/userLocation.service';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
imports: [
        CommonModule,
        FormsModule,
        IonicStorageModule.forRoot()
    ],
  declarations: [],
  exports:      [],
  providers: [
    LocationService,
    UserService,
    UserLocationService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
