import { Component, NgZone } from '@angular/core';
import { NavController, AlertController, AlertOptions, FabContainer } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { PlacePage } from '../place/place';
import { Place } from '../../shared/placeInterface';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  placeRef: AngularFirestoreCollection<Place>;
  af$: Observable<Place[]>;

  Places: Place[];

  constructor(public navCtrl: NavController, public afs: AngularFirestore, public zone: NgZone, public alertCtrl: AlertController) {

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
  stopSynch() { }

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

}
