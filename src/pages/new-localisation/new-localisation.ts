import { Component, NgZone } from '@angular/core';
import { AlertController, AlertOptions } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Camera } from '@ionic-native/camera';
import { CameraOptions } from '@ionic-native/camera';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LocationTrackerProvider } from '../../shared/providers/location-tracker';
import { Place } from '../../shared/placeInterface';
import { dataSettings } from '../../pages/settings/dataSettings';

import { AuthProvider } from '../../shared/providers/auth';

@Component({
  selector: 'page-new-localisation',
  templateUrl: 'new-localisation.html',
})

export class NewLocalisationPage {

  alertOpts: AlertOptions;
  createStep: number = 0;
  trackingNfo: string = "Géolocalisation non démarrée";
  public newPlaceForm: FormGroup;

  placeRef: AngularFirestoreCollection<Place>;
  af$: Observable<Place[]>;
  totPlaces: number = 0;

  pDataImg: string; // base64 image

  constructor(public alertCtrl: AlertController, private camera: Camera, public locationTracker: LocationTrackerProvider, public afs: AngularFirestore, public zone: NgZone, public authProvider: AuthProvider, formBuilder: FormBuilder) {

    this.placeRef = this.afs.collection<Place>(this.authProvider.afAuth.auth.currentUser.uid); //firebase collection name

    /*
        this.placeRef.snapshotChanges()
        .subscribe(actions => {
             console.log("-------------------------------------actions"+actions);
             actions.forEach(action => {
              console.log("action.type="+action.type);
              console.log("payload="+action.payload.doc);
              console.log("newIndex="+action.payload.newIndex);
              console.log("oldIndex="+action.payload.oldIndex);
            })
            })
            */

    //workaround because no callback to dispatch a message available when offline
    this.placeRef.valueChanges()
      .subscribe(actions => {

        if (this.totPlaces < actions.length && this.totPlaces != 0) { this.onUploadComplete(); }
        this.totPlaces = actions.length;

        /*actions.forEach(action => {
          console.log("altitude="+action.id);
          console.log("dataImg="+action.altitude);
        })*/
      })

    this.newPlaceForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      note: ['', Validators.compose([Validators.required])]
    });

  }

  datasCompleted(): boolean {
    if (!this.pDataImg) return false;
    if (this.locationTracker.lat == 0 || this.locationTracker.lng == 0) return false;
    return true;
  }

  ionViewDidLoad() { this.initialize(); }

  initialize() {
    this.createStep = 1;
    this.pDataImg = undefined;
    this.newPlaceForm.reset();
    this.locationTracker.resetDatas();
    if(this.locationTracker.isWatching) this.stopTracking();
  }

  /* STEP1 Choose a file - camera vs local storage image gallery *************/

  importFromGallery() {
    this.createStep = 2;
    //aa tmp:
    let d = new Date();
    let nd = new Date(d.getTime());

    this.placeRef.add({
      name: "fake",
      note: "fake",
      dYear: nd.getFullYear(),
      dMonth: nd.getMonth() + 1,
      dDay: nd.getDate(),
      dHour: nd.getHours(),
      dMin: nd.getMinutes(),
      latitude: 0,
      longitude: 0,
      altitude: 0,
      dataImg: 'fake'
    })
      .then((docRef) => {
        // only if mobile datas or wifi enabled
        console.log("Document written with ID: ", docRef.id);

        //this.onUploadComplete();

      }).catch((error) => {

        console.error("Error adding document: ", error);
      });

  }

  // TODO: crop image
  importFromCamera() {
    this.createStep = 2;

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

      let d = new Date();
      let nd = new Date(d.getTime());

      this.placeRef.add({
        name: this.newPlaceForm.value.name,
        note: this.newPlaceForm.value.note,
        dYear: nd.getFullYear(),
        dMonth: nd.getMonth() + 1,
        dDay: nd.getDate(),
        dHour: nd.getHours(),
        dMin: nd.getMinutes(),
        latitude: this.locationTracker.lat,
        longitude: this.locationTracker.lng,
        altitude: this.locationTracker.alt,
        dataImg: this.pDataImg
      })
      /* see workaround "this.placeRef.valueChanges"
        .then((docRef) => {
          // only if mobile datas or wifi enabled
          console.log("Document written with ID: ", docRef.id);

          //this.onUploadComplete();

        }).catch((error) => {

          console.error("Error adding document: ", error);
        });*/

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
