import { NgModule } from '@angular/core';
import {
  MatTableModule,
  MatStepperModule,
  MatButtonModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatIconModule,
  MatPaginatorModule,
  MatNativeDateModule,
  MatSortModule,
  MatAutocompleteModule
} from '@angular/material';

import { SelectAutocompleteComponent } from 'select-autocomplete';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatTableModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    SelectAutocompleteComponent
  ]
})
export class MaterialModule {}
