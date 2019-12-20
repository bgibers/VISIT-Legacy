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
  public displayError = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  public validate() {

  }

  public register() {
    this.userService.userRegisterUser(this.user).subscribe((res) => {
      console.log(res);
      if (res !== null) {
        this.router.navigateByUrl('home');
      } else {
        this.displayError = true;
      }
    });
  }

}
