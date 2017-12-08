import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { dataSettings } from './dataSettings';

import { Insomnia } from '@ionic-native/insomnia';

@Component({
  selector: 'settings',
  templateUrl: 'settings.html',
})

export class SettingsPage {

  locMsge: string = "Au moins un type de géolocalisation doit être activé !"

  constructor(public toastCtrl: ToastController, private insomnia: Insomnia) { }

  /* LANGUAGE french vs english ***********************************************/
  switchLanguage() {

    let b: boolean = dataSettings.language.fr;
    dataSettings.language.fr = !b;
    dataSettings.language.en = b;

  }

  /* UNITS metric vs imperial ***********************************************/
  switchUnits() {

    let b: boolean = dataSettings.units.metric;
    dataSettings.units.metric = !b;
    dataSettings.units.imperial = b;

  }

  /* LOCALISATION Type ( at least one type) **********************************/
  setBgGeolocation() {

    if (!dataSettings.geolocation.foreground && !dataSettings.geolocation.background) {
      dataSettings.geolocation.foreground = true;
      this.showToast(this.locMsge);
    }

  }

  setFgGeolocation() {

    if (!dataSettings.geolocation.foreground && !dataSettings.geolocation.background) {
      dataSettings.geolocation.background = true;
      this.showToast(this.locMsge);
    }

  }

  /* MAPS ********************************************************************/
  switchMapProvider() {

    let b: boolean = dataSettings.maps.osm;
    dataSettings.maps.osm = !b;
    dataSettings.maps.google = b;

  }

  /* IMAGE PROPERTIES  *******************************************************/

  setImageSize() {

    dataSettings.image.height = Math.round(dataSettings.image.width * 9 / 16);

  }
  /* MAPS ********************************************************************/
  switchInsomnia() {

    if (dataSettings.global.insomnia) {
      this.insomnia.keepAwake()/*.then(
        () => console.log('keep awake'),
        () => console.log('error')
      );*/
    }
    else {
      this.insomnia.allowSleepAgain()/*.then(
        () => console.log('sleep again'),
        () => console.log('error')
      );*/
    }

  }

  /* UTILS *******************************************************************/

  getData() { return dataSettings; }

  showToast(msg: string) {

    let toast = this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();

  }

}
