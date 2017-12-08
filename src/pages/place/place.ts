import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { Place } from '../../shared/placeInterface';
import { dataSettings } from '../../pages/settings/dataSettings';
import { MapOsmPage } from '../map/osm/map-osm';
import { MapGooglePage } from '../map/google/map-google';

@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {

  p: Place;

  constructor(public navParams: NavParams, public navCtrl: NavController) {
    this.p = navParams.get('p');
  }

  /***************************  NAVIGATION *******************************************************************/
  goToMapPage() {
    if (dataSettings.maps.osm) {
      this.navCtrl.push(MapOsmPage, { lat: this.p.latitude, lng: this.p.longitude, name: this.p.name });
    }
    else {
      this.navCtrl.push(MapGooglePage)
    }
  }

}
