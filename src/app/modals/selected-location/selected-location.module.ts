import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SelectedLocationPage } from './selected-location.page';
import { CustomFooterComponent } from '../../custom-footer/custom-footer.component';

const routes: Routes = [
  {
    path: '',
    component: SelectedLocationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SelectedLocationPage],
  exports: [SelectedLocationPage]

})
export class SelectedLocationPageModule {}
