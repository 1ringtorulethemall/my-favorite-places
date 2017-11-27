import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { Place } from '../../shared/placeInterface';
import { MapPage } from '../map/map';


@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {

  p: Place;

  constructor(public navParams: NavParams, public navCtrl : NavController) {
    this.p = navParams.get('p');
  }

  ionViewDidLoad() { }

  /***************************  NAVIGATION *******************************************************************/
  goToMapPage() {
    this.navCtrl.push(MapPage, { lat: this.p.latitude, lng: this.p.longitude, name:this.p.name });
  }

}
