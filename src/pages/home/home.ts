import { Component, NgZone } from '@angular/core';
import { NavController, AlertController, AlertOptions, FabContainer } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { AuthProvider } from '../../shared/providers/auth';

import { dataSettings } from '../../pages/settings/dataSettings';
import { PlacePage } from '../../pages/place/place';
import { MapOsmPage } from '../map/osm/map-osm';
import { MapGooglePage } from '../map/google/map-google';
import { Place } from '../../shared/placeInterface';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  placeRef: AngularFirestoreCollection<Place>;
  af$: Observable<Place[]>;

  Places: Place[];

  constructor(public navCtrl: NavController, public afs: AngularFirestore, public zone: NgZone, public alertCtrl: AlertController, public authProvider: AuthProvider) {

    this.placeRef = this.afs.collection<Place>(this.authProvider.afAuth.auth.currentUser.uid);
    this.af$ = this.placeRef.snapshotChanges().map(actions => {
      return actions
        .map(action => {
          const data = action.payload.doc.data() as Place;
          // +const settings = ...
          const id = action.payload.doc.id;
          return { id, ...data };
        });
    })
      .do(data => {
        this.Places = data as Place[];
      })/*
      .do (settings => {
        mySettings = settings
      })
      */
      ;



  }

  /* place deletion ******************************************************/

  deleteConfirmation(af: Place) {

    let alertOpts: AlertOptions = {
      title: 'Souhaitez-vous vraiment supprimer cette fiche :<br><i>' + af.name + '</i> ?',
      subTitle: '(Toute suppression est définitive aussi bien online que offline)',
      buttons: [
        { text: 'CONSERVER' },
        {
          text: 'SUPPRIMER',
          handler: () => { this.delete(af) }
        }
      ]
    }

    let alert = this.alertCtrl.create(alertOpts);
    alert.present();

  }

  //remove place from both offline & online database

  delete(af: Place) {
    this.placeRef.doc(af.id).delete();
  }

  /***************************  NAVIGATION *******************************************************************/
  goToPlacePage(p: Place, fab: FabContainer) {
    fab.close();
    this.navCtrl.push(PlacePage, { p: p });

  }

  goToPlaceMap(p: Place, fab: FabContainer) {
    fab.close();

    if (dataSettings.maps.osm) {
      this.navCtrl.push(MapOsmPage, { lat: p.latitude, lng: p.longitude, name: p.name });
    }
    else {
      this.navCtrl.push(MapGooglePage)
    }
  }

}
