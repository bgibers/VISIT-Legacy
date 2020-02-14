import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators, FormControlName } from '@angular/forms';

export class AppCustomDirective extends Validators {

   static passwordLength(fControl: FormControl) {

    const pass = fControl.value;
    if (pass.length < 6 || pass.length > 12) {
      return { invalidPassCriteria: true };
    }
  }
}
