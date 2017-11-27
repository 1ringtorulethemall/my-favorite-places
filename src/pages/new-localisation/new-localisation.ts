import { Component, NgZone } from '@angular/core';
import { NavController, AlertController, AlertOptions } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import firebase from 'firebase'; // pictures storage
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Camera } from '@ionic-native/camera';
import { CameraOptions } from '@ionic-native/camera';

import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { Place } from '../../shared/placeInterface'

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

  captureDataUrl: string;

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

  ionViewDidLoad() {
    this.initialize();
  }

  initialize() {
    this.createStep = 1;
    this.captureDataUrl = undefined;// clear the previous photo data in the variable
  }

  /* STEP1 Choose a file - camera vs local storage image gallery *************/

  importFromGallery() {
    this.createStep = 2;

    //this.startTracking();
  }

  // TODO: crop image
  importFromCamera() {
    this.createStep = 2;

    // TODO: adjust cam options
    const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;

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

  /* STEP ... save */
  addImageToPlace(): void {
    //  uploadImage

    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = this.storageRef.child(`imgs/${filename}.jpg`);

    imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL)
      .then((snapshot) => {
        console.log("ok upload image")
        imageRef.getDownloadURL().then((url) => {
          this.zone.run(() => {
            this.addNfosToPlace(url);
          })
        })
      });

  }

  addNfosToPlace(url: string) {

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
        //latitude: 0,longitude: 0,altitude: 0,
        latitude: this.locationTracker.lat, longitude: this.locationTracker.lng, altitude: this.locationTracker.alt,
        imgUrl: url
      })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);

          this.onUploadComplete();

        }).catch((error) => {
          console.error("Error adding document: ", error);
        });
    }

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
