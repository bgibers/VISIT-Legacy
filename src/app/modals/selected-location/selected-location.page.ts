import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-selected-location',
  templateUrl: './selected-location.page.html',
  styleUrls: ['./selected-location.page.scss'],
})
export class SelectedLocationPage implements OnInit {

  constructor(private navParams: NavParams,
              private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  cancel() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
   this.modalCtrl.dismiss();
  }

}
