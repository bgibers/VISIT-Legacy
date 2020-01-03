import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SelectedLocationPage } from '../modals/selected-location/selected-location.page';
@Component({
  selector: 'app-custom-footer',
  templateUrl: './custom-footer.component.html',
  styleUrls: ['./custom-footer.component.scss'],
})
export class CustomFooterComponent {

  @Input() selectedArea: any;
  constructor(public modalController: ModalController) { }

  onClick() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SelectedLocationPage
    });
    return await modal.present();
  }

}
