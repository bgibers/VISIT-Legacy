import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { CustomHeaderComponent } from '../../components/custom-header/custom-header.component';
import { CustomFooterComponent } from '../../components/custom-footer/custom-footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [
    HomePage,
    CustomHeaderComponent,
    CustomFooterComponent,
  ]
})
export class HomePageModule {}
