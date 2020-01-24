import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { RegisterPage } from './register.page';
import { MaterialModule } from '../../modules/material.module';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegisterPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterPageModule {}
