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

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  public register() {
    this.userService.userRegisterUser(this.user).subscribe((res) => {
      this.router.navigateByUrl('home');
    });
  }

}
