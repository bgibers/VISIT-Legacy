import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from '../client/api/user.service';
 
 
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
      public authenticationService: UserService
        ) {}
 
    canActivate(): boolean {
      return this.authenticationService.isLoggedIn();
    }
 
}