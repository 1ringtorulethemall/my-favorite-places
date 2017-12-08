import { Component, NgZone } from '@angular/core';
import { AlertController, AlertOptions } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import firebase from 'firebase'; // pictures storage
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Camera } from '@ionic-native/camera';
import { CameraOptions } from '@ionic-native/camera';

import { LocationTrackerProvider } from '../../shared/providers/location-tracker';
import { Place } from '../../shared/placeInterface';
import { dataSettings } from '../../pages/settings/dataSettings';

@Component({
  selector: 'page-new-localisation',
  templateUrl: 'new-localisation.html',
})

export class NewLocalisationPage {

  alertOpts: AlertOptions;
  createStep: number = 0;
  trackingNfo: string = "Géolocalisation non démarrée";

  storageRef = firebase.storage().ref(); //root storage reference
  placeRef: AngularFirestoreCollection<Place>;
  af$: Observable<Place[]>;

  public pName: string = '';
  public pNote: string = '';
  pDataImg: string; // base64 image

  constructor(public alertCtrl: AlertController, private camera: Camera, public locationTracker: LocationTrackerProvider, public afs: AngularFirestore, public zone: NgZone) {

    this.placeRef = this.afs.collection<Place>('myPlaces'); //firebase collection name
    this.af$ = this.placeRef.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Place;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });

  }

  ionViewDidLoad() { this.initialize(); }

  initialize() {
    this.createStep = 1;
    this.pDataImg = undefined;
  }

  /* STEP1 Choose a file - camera vs local storage image gallery *************/

  importFromGallery() {
    this.createStep = 2;

    //this.startTracking();
  }

  // TODO: crop image
  importFromCamera() {
    this.createStep = 2;
    //aa datas trop grosses, passe pas
    // TODO: adjust cam options + fix acceptable image size ( @settings)
    const cameraOptions: CameraOptions = {
      targetWidth: dataSettings.image.width,
      targetHeight: dataSettings.image.height,
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(cameraOptions).then((dataImg) => {
      this.pDataImg = 'data:image/jpeg;base64,' + dataImg; // base64 encoded string for firecloud storage (offline workaround )

      //this.startTracking();

    }, (err) => {
      // Handle error
    });

  }

  /* STEP2 Capture Position **************************************************/

  startTracking() {
    this.trackingNfo = "géolocalisation en cours ...";
    this.locationTracker.startTracking();
  }

  stopTracking() {
    this.trackingNfo = "géolocalisation arrêtée";
    this.locationTracker.stopTracking();
  }

  showAlert() {

    this.alertOpts = {
      title: 'Récupération des coordonnées impossibles.',
      subTitle: 'Vous pouvez les rentrer manuellement',
      buttons: ['OK']
    }

    let alert = this.alertCtrl.create(this.alertOpts);
    alert.present();

  }

  /* FINAL STEP ... save ******************************************************/

  addPlace() {

    if (this.pNote && this.pNote.trim().length && this.pName && this.pName.trim().length && this.locationTracker.lat && this.locationTracker.lng) {
      //if (this.pNote && this.pNote.trim().length && this.pName && this.pName.trim().length) {

      let d = new Date();
      let nd = new Date(d.getTime());

      this.placeRef.add({
        name: this.pName,
        note: this.pNote,
        dYear: nd.getFullYear(),
        dMonth: nd.getMonth(),
        dDay: nd.getDate(),
        dHour: nd.getHours(),
        dMin: nd.getMinutes(),
        dSec: nd.getSeconds(),
        //latitude: 0,
        //longitude: 0,
        //altitude: 0,
        latitude: this.locationTracker.lat,
        longitude: this.locationTracker.lng,
        altitude: this.locationTracker.alt,
        dataImg: this.pDataImg
      })
        .then((docRef) => {
          // only if mobile datas or wifi enabled
          console.log("Document written with ID: ", docRef.id);

          this.onUploadComplete();

        }).catch((error) => {

          console.error("Error adding document: ", error);
        });
    }


    // TODO: no connexion quid de la callback

  }

  onUploadComplete() {

    let alert = this.alertCtrl.create({
      title: "Perfect, this place has been saved !",
      buttons: ['OK']
    });
    alert.present();

    this.initialize();
  }

}
