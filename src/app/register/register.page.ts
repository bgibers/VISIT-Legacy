import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FormControl, FormGroupDirective, FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatStepper } from '@angular/material/stepper';

import { Country, State, LocationSelector } from '../objects/location.selector';
import { UserService, RegistrationUserApi, CredentialsViewModel } from '../backend/client';
import { AppCustomDirective } from './validators';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid);
  }
}
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
  public canRegister = false;
  public basicInfoForm: FormGroup;
  public userInfoForm: FormGroup;
  public birthForm: FormGroup;
  public residenceForm: FormGroup;
  public dreamForm: FormGroup;
  public titleForm: FormGroup;


  public countryOptions: Array<Country>;
  public stateOptions: Array<State>;

  public minDate = new Date(Date.now());
  public maxDate = new Date(Date.now());
  public startDate = this.maxDate;
  public matcher: MyErrorStateMatcher;
  public birthplaceOptions: Observable<State[]>;
  public resideOptions: Observable<State[]>;
  public dreamOptions: Observable<State[]>;

  constructor(private userService: UserService, private router: Router,
              private fb: FormBuilder, private selector: LocationSelector) {

    // setting the min date and thus the max birth date allowing < 100 year old choosable birthdate
    this.minDate.setDate( this.minDate.getDate() );
    this.minDate.setFullYear( this.minDate.getFullYear() - 100 );

    // setting the calendar's start date and youngest birth dates for > 16 years old
    this.maxDate.setDate( this.maxDate.getDate() );
    this.maxDate.setFullYear( this.maxDate.getFullYear() - 16 );
    this.startDate = this.maxDate;
    this.matcher = new MyErrorStateMatcher();
  }

  ngOnInit() {
    this.basicInfoForm = this.fb.group({
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      email: ['', Validators.email],
      birthday: ['', Validators.required]
    });

    this.userInfoForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', AppCustomDirective.passwordLength],
      passwordConfirm: ['']
    });

    this.birthForm = this.fb.group({
      birthplace: ['', Validators.required]
    });

    this.residenceForm = this.fb.group({
      residesIn: ['', Validators.required]
    });

    this.dreamForm = this.fb.group({
      dreamDestination: ['', Validators.required]
    });

    this.titleForm = this.fb.group({
      education: ['', Validators.required],
      occupationTitle: ['', Validators.required]
    });

    this.countryOptions = this.selector.getCountries().Countries;
    this.stateOptions = this.selector.getStates().States;

    this.birthplaceOptions = this.birthForm.get('birthplace').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.resideOptions = this.residenceForm.get('residesIn').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  public _filter(value: string): Array<State> {
    const filterValue = value.toLowerCase();
    return this.countryOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  public validatePassword(form: FormGroup, stepper: MatStepper) {

    const pass = form.controls.password.value;
    const confirmPass = form.controls.passwordConfirm.value;

    if ( pass === confirmPass ) {
      stepper.next();
      this.displayError = false;
    } else {
      this.displayError = true;

    }
  }

  public openLogin() {
    this.router.navigateByUrl('login');
  }

  public register() {
    this.userService.userRegisterUser(this.user).subscribe((res) => {
      if (res !== null) {
        this.openLoginWSuccess();
      } else {
        this.displayError = true;
        this.error = 'Username is not available';
      }
    });
  }

  public openLoginWSuccess() {
    const navigationExtras: NavigationExtras = {
      state: {
        newUser: this.user.userName
      }
    };
    this.router.navigate(['/login'], navigationExtras);
  }
}

