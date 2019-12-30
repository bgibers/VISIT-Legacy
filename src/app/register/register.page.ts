import { Component, OnInit } from '@angular/core';
import { Router } from  '@angular/router';
import { UserService, RegistrationUserApi, CredentialsViewModel } from '../backend/client';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public user: RegistrationUserApi =  {} as RegistrationUserApi ;
  public error: string;
  public passwordVal: string;
  public displayError = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  public validatePassword(): boolean {

    if (this.passwordVal !== this.user.password) {
      this.error = 'Passwords do not match';
      this.displayError = true;
      return false;
    }

    if (this.user.password.length < 6 || this.user.password.length > 12 ) {
      this.error = 'Password must be between 6-12 characters';
      this.displayError = true;
      return false;
    }

    return true;
  }

  public openLogin() {
    this.router.navigateByUrl('login');
  }

  public register() {
    if (this.validatePassword()) {
    this.userService.userRegisterUser(this.user).subscribe((res) => {
      console.log(res);
      if (res !== null) {
        this.router.navigateByUrl('login');
      } else {
        this.displayError = true;
        this.error = 'Username is not available';
      }
    });
  }
  }

}
