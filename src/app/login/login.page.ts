import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, CredentialsViewModel } from '../backend/client';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private credentials: CredentialsViewModel = {} as CredentialsViewModel ;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  public login() {
    this.userService.userLoginUser(this.credentials).subscribe((res) => {
      this.router.navigateByUrl('home');
    });
  }

  public openRegister() {
      this.router.navigateByUrl('register');
  }

}
