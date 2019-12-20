import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, CredentialsViewModel } from '../backend/client';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public credentials: CredentialsViewModel = {} as CredentialsViewModel ;
  public error: string;
  public displayError = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  public login() {
    this.userService.userLoginUser(this.credentials).subscribe((res) => {
      if (res !== null) {
        this.router.navigateByUrl('home');
      } else {
        this.error = 'Invalid username/password';
        this.displayError = true;
      }
    });
  }

  public openRegister() {
      this.router.navigateByUrl('register');
  }

}
