import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { PostRegisterPage } from './post-register.page';
import { MaterialModule } from '../../modules/material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes: Routes = [
  {
    path: '',
    component: PostRegisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PostRegisterPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PostRegisterPageModule {}
