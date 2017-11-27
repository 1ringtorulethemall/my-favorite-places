import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import firebase from 'firebase';
import { Observable } from 'rxjs/Observable'; //TODO = delete unused
import 'rxjs/add/operator/do';

import { PlacePage } from '../place/place';
import { Place } from '../../shared/placeInterface';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  firestore = firebase.storage();
  placeRef: AngularFirestoreCollection<Place>;
  af$: Observable<Place[]>;

  Places: Place[];
  imgUrls: string[] = [];

  constructor(public navCtrl: NavController, public afs: AngularFirestore, public zone: NgZone) {

    this.placeRef = this.afs.collection<Place>('myPlaces');
    this.af$ = this.placeRef.snapshotChanges().map(actions => {
      return actions
        .map(action => {
          const data = action.payload.doc.data() as Place;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
    })
      .do(data => {
        this.Places = data as Place[];
      });

  }

  // TODO:
  startSynch() {
    //https://firebase.google.com/docs/database/android/offline-capabilities
  }
  stopSynch() {  }

  /***************************  NAVIGATION *******************************************************************/
  goToPlacePage(p: Place, url: string) {
    this.navCtrl.push(PlacePage, { p: p});
  }

}
