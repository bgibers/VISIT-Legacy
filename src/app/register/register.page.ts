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

  public displayBirthState = false;
  public displayResidenceState = false;

  public passwordVal: string;
  public displayError = false;

  public basicInfoForm: FormGroup;
  public userInfoForm: FormGroup;
  public birthForm: FormGroup;
  public residenceForm: FormGroup;
  public titleForm: FormGroup;

  public countryOptions: Array<Country>;
  public stateOptions: Array<State>;

  public minDate = new Date(Date.now());
  public maxDate = new Date(Date.now());
  public startDate = this.maxDate;
  public matcher: MyErrorStateMatcher;
  public birthStateObservable: Observable<State[]>;
  public birthCountryObservable: Observable<State[]>;
  public residenceStateObservable: Observable<State[]>;
  public residenceCountryObservable: Observable<State[]>;


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
      country: ['', Validators.required],
      state: ['']
    });

    this.residenceForm = this.fb.group({
      country: ['', Validators.required],
      state: ['']
    });

    this.titleForm = this.fb.group({
      education: ['', Validators.required],
      occupationTitle: ['', Validators.required]
    });

    this.countryOptions = this.selector.getCountries().Countries;
    this.stateOptions = this.selector.getStates().States;

    this.birthCountryObservable = this.birthForm.get('country').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCountry(value))
    );

    this.birthStateObservable = this.birthForm.get('state').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterState(value))
    );

    this.residenceCountryObservable = this.residenceForm.get('country').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCountry(value))
    );

    this.residenceStateObservable = this.residenceForm.get('state').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterState(value))
    );
  }

  public _filterCountry(value: string): Array<State> {
    const filterValue = value.toLowerCase();
    return this.countryOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  public _filterState(value: string): Array<State> {
    const filterValue = value.toLowerCase();
    return this.stateOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  get canRegister(): boolean {
    if (this.titleForm.status === 'VALID'
        && this.basicInfoForm.status === 'VALID'
        && this.userInfoForm.status === 'VALID'
        && this.birthForm.status === 'VALID'
        && this.residenceForm.status === 'VALID') {
          return true;
        }
    return false;
  }

  public checkInputValue() {
    if (this.birthForm.controls.country.value === 'United States') {
      this.displayBirthState = true;
    } else {
        this.displayBirthState = false;
        this.birthForm.controls.state.setValue('');
    }

    if (this.residenceForm.controls.country.value === 'United States') {
      this.displayResidenceState = true;
    } else {
        this.displayResidenceState = false;
        this.residenceForm.controls.state.setValue('');
    }
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
    this.user = {
      fName : this.basicInfoForm.controls.fName.value,
      lName : this.basicInfoForm.controls.lName.value,
      email : this.basicInfoForm.controls.email.value,
      birthday : this.basicInfoForm.controls.birthday.value,
      userName : this.userInfoForm.controls.username.value,
      password : this.userInfoForm.controls.password.value,
      birthPlace : this.birthForm.controls.state.value === '' ?
                  this.birthForm.controls.country.value : this.birthForm.controls.state.value,
      residesIn : this.residenceForm.controls.state.value === '' ?
      this.residenceForm.controls.country.value : this.residenceForm.controls.state.value,
      education : this.titleForm.controls.education.value,
      occupationTitle : this.titleForm.controls.occupationTitle.value,

    } as RegistrationUserApi;

    this.userService.userRegisterUser(this.user).subscribe((res) => {
      if (res !== null) {
        this.openLoginWSuccess();
      } else {
        this.displayError = true;
        this.error = 'Username or email is already taken';
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

