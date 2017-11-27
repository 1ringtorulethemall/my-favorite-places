import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import L from "leaflet";

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {

  map: L.Map;
  center: L.PointTuple;
  name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    //set map center
    //this.center = [0.231492,73.271087]; // maldives
    this.center = [navParams.get('lat'), navParams.get('lng')];
    this.name = navParams.get('name');
  }

  ionViewDidLoad() {
    this.initMap();
  }

  initMap() {
    //setup leaflet map
    this.map = L.map('map', {
      center: this.center,
      zoom: 16
    });

    //Add Open Street Map Layer
    // TODO: Récupérer des blocs cartes

    /*  L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
          .addTo(this.map);*/

    var marker = new L.Marker(this.center);
    this.map.addLayer(marker);

    marker.bindPopup(this.name);
    marker.openPopup();

    var mk2 = L.marker([45.73990626, 6.12767908]).bindPopup('fake place1')
    var mk3 = L.marker([45.74049449, 6.12726955]).bindPopup('fake place2')
    var otherSpot = L.layerGroup([mk2, mk3]);

    var baseMap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);
    var outDoorMap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2pjeWdjY2NjZ3ljIiwiYSI6ImNqYWQwOWd3ZzFneDIyeXA4bnN3Mzk3bnIifQ.m3R9eKoZz4FJT2lw3gLDrA').addTo(this.map);
    //var baseMap = L.tileLayer('http://a.tile.thunderforest.com/landscape/{z}/{x}/{y}.png').addTo(this.map);
    //var baseMap = L.tileLayer('http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg').addTo(this.map);

//https://geoservices.ign.fr/


    var satMap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2pjeWdjY2NjZ3ljIiwiYSI6ImNqYWQwOWd3ZzFneDIyeXA4bnN3Mzk3bnIifQ.m3R9eKoZz4FJT2lw3gLDrA').addTo(this.map);

    // NOTE: voir https://www.mapbox.com/studio/styles/mapbox/outdoors-v9/ mais marche avec token donc online
    var baseMaps = {
      "Carte de base": baseMap,
      "Outdoor": outDoorMap,
      "Satellite": satMap
    };

    var otherSpotsMap = {
      "Mes endroits": otherSpot
    };

    L.control.layers(baseMaps, otherSpotsMap).addTo(this.map);
  }

}
