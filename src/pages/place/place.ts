import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController, ToastController, Select } from 'ionic-angular';

import { Place } from '../../shared/placeInterface';
import { dataSettings } from '../../pages/settings/dataSettings';
import { MapOsmPage } from '../map/osm/map-osm';
import { MapGooglePage } from '../map/google/map-google';

import { AngularFirestore } from 'angularfire2/firestore';
import { AuthProvider } from '../../shared/providers/auth';

@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {

  p: Place;

  //modify datas
  nameUpdating: boolean = false;
  nameContent: string;

  selectedCategories: Array<any> = [
    { text: 'Champignons', value: 'champignons' },
    { text: 'Myrtilles', value: 'myrtilles' }
  ];
  availableCategories: Array<any> = dataSettings.categories;
  categoryAlertOpts = {
    title: 'Catégorie(s) :',
    message: 'Vous pouvez créer de nouvelles catégories dans les paramètres', //TODO category création directly here
  };
  categoriesUpdating: boolean = false;

  posUpdating: boolean = false;
  posDatas: PosDatas = { latitude: 0, longitude: 0, altitude: 0 };

  noteUpdating: boolean = false;
  noteContent: string;

  @ViewChild('selectCat') selectCat: Select;

  constructor(public navParams: NavParams, public navCtrl: NavController, public authProvider: AuthProvider, public afs: AngularFirestore, public toastCtrl: ToastController) {

    this.p = navParams.get('p');

  }

  /***************************  NAVIGATION ***********************************/
  goToMapPage() {
    if (dataSettings.maps.osm) {
      this.navCtrl.push(MapOsmPage, { lat: this.p.latitude, lng: this.p.longitude, name: this.p.name });
    }
    else {
      this.navCtrl.push(MapGooglePage);
    }
  }

  /******* UPDATES ***********************************************************/

  // Name update ***************************************************
  modifyName() {

    this.nameUpdating = true
    this.nameContent = this.p.name;

  }

  updateName(dataObj: any): Promise<any> {

    return new Promise((resolve, reject) => {
      this.afs
        .collection(this.authProvider.afAuth.auth.currentUser.uid)
        .doc(this.p.id)
        .update(dataObj)
        .then((obj: any) => {
          resolve(obj);
          this.showToast("La modification du nom a bien été prise en compte")
          this.nameUpdating = false;
        })
        .catch((error: any) => {
          this.cancelNameUpdate()
          this.showToastWithError(error)
          reject(error);

        });
    });
  }

  cancelNameUpdate() {
    this.nameUpdating = false;
    this.p.name = this.nameContent;
  }

  // categories update ***************************************************

  modifyCategories() {
    this.categoriesUpdating = true;

    setTimeout(() => {
      this.selectCat.open();
      this.selectCat.selectedText = " "; // see css : .select-icon { visibility: hidden !important;}
    }, 1);

  }

  updateCategories(): Promise<any> {
    //TODO openselect + nochange --> ni update ni cancel (donc le crayon) ne se remettent

    return new Promise((resolve, reject) => {
      this.afs
        .collection(this.authProvider.afAuth.auth.currentUser.uid)
        .doc(this.p.id)
        .update({ categories: this.selectedCategories })
        .then((obj: any) => {
          resolve(obj);
          this.showToast("La modification des catégories a bien été prise en compte");
          this.categoriesUpdating = false;
          this.selectCat.selectedText = " "; // see css : .select-icon { visibility: hidden !important;}
        })
        .catch((error: any) => {
          this.cancelCategoriesUpdate();
          this.showToastWithError(error);
          reject(error);

        });
    });
  }

  compareFn(option1: any, option2: any) {
    return option1.value === option2.value;
  }

  cancelCategoriesUpdate() {

    this.categoriesUpdating = false;
    this.selectCat.selectedText = " ";

  }

  getSelectedCategories(): string {
    let sCat: string = "Catégorie(s) : ";
    let i: number = 0;
    let l: number = this.selectedCategories.length;
    for (let s of this.selectedCategories) {
      i++;
      sCat += s.text;
      if (i < l) sCat += ", ";
    }
    return sCat;

  }

  //position update ***************************************************
  modifyPosition() {
    this.posUpdating = true;
    this.posDatas.latitude = this.p.latitude;
    this.posDatas.longitude = this.p.longitude;
    this.posDatas.altitude = this.p.altitude;
  }

  updatePosition(dataObj: any): Promise<any> {

    return new Promise((resolve, reject) => {
      this.afs
        .collection(this.authProvider.afAuth.auth.currentUser.uid)
        .doc(this.p.id)
        .update(dataObj)
        .then((obj: any) => {
          resolve(obj);
          this.showToast("La modification de la position a bien été prise en compte");
          this.posUpdating = false;
        })
        .catch((error: any) => {
          this.cancelPositionUpdate();
          this.showToastWithError(error);
          reject(error);

        });
    });
  }

  cancelPositionUpdate() {

    this.posUpdating = false;
    this.p.latitude = this.posDatas.latitude;
    this.p.longitude = this.posDatas.longitude;
    this.p.altitude = this.posDatas.altitude;

  }

  // note update ***************************************************
  ModifyNote() {

    this.noteUpdating = true
    this.noteContent = this.p.note;

  }

  updateNote(dataObj: any): Promise<any> {

    return new Promise((resolve, reject) => {
      this.afs
        .collection(this.authProvider.afAuth.auth.currentUser.uid)
        .doc(this.p.id)
        .update(dataObj)
        .then((obj: any) => {
          resolve(obj);
          this.showToast("La modification de la note a bien été prise en compte")
          this.noteUpdating = false;
        })
        .catch((error: any) => {
          this.cancelNoteUpdate()
          this.showToastWithError(error)
          reject(error);

        });
    });
  }

  cancelNoteUpdate() {
    this.noteUpdating = false;
    this.p.note = this.noteContent;
  }


  // utils ***************************************************

  showToast(msg: string) {

    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2500
    });
    toast.present();

  }

  showToastWithError(msg: string) {

    let toast = this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();

  }

}

interface PosDatas {
  latitude: number;
  longitude: number;
  altitude: number;
}
