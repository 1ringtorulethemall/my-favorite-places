import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Events, AlertController } from 'ionic-angular';

import * as L from 'leaflet';
import 'leaflet-easybutton';
import { CompassComponent } from "../../../components/compass/compass";

import { LocationTrackerProvider } from '../../../shared/providers/location-tracker';
import { dataSettings } from '../../../pages/settings/dataSettings';

@Component({
  selector: 'page-map-osm',
  templateUrl: 'map-osm.html',
})

export class MapOsmPage {

  //point to reach
  map: L.Map;
  center: L.PointTuple;
  name: string;

  //real time position
  rtMk: any;
  rtLat: number = 0;
  rtLng: number = 0;
  rtGeoCalls: number = 0; // for debug if needed
  rtIcon: any = L.icon({ //TODO ? http://leafletjs.com/examples/custom-icons/
    //TODO mettre marker avec perso qui marche
    iconUrl: 'assets/imgs/leaflet/marker-icon-rt.png',
    //iconRetinaUrl: 'my-icon@2x.png', //TODO
    shadowUrl: 'assets/imgs/leaflet/marker-shadow.png',
    //shadowRetinaUrl: 'my-icon-shadow@2x.png', //TODO
    tooltipAnchor: [12, -41],
    iconSize: [25, 41], // size of the icon
    shadowSize: [41, 41], // size of the shadow
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [12, 41],  // the same for the shadow
    popupAnchor: [1, -34] // point from which the popup should open relative to the iconAnchor
  });

  // compass
  compassStarted: boolean = false;

  @ViewChild(CompassComponent) compassComponent: CompassComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams, public locationTracker: LocationTrackerProvider, public events: Events, public alertCtrl: AlertController) {

    //set map center
    //this.center = [0.231492,73.271087]; // maldives
    this.center = [navParams.get('lat'), navParams.get('lng')];
    this.name = navParams.get('name');

  }

  ionViewDidLoad() { this.initMap(); }

  initMap() {
    //offline map (same map)
    let offlineMap = L.tileLayer('assets/maps/bauges/{z}/{x}/{y}.png')//.addTo(this.map);
    let opentopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png')//.addTo(this.map);
    let onLineMaps = {
      "offline Map": offlineMap,
      "(same) online map": opentopoMap

    };

    //setup leaflet map
    this.map = L.map('map', {
      center: this.center,
      //center: L.latLng(40.731253, -73.996139),
      //zoomControl: false,
      //minZoom: 4,
      maxZoom: 17, // adjust depending of current map zoomMax
      //layers: [this.mapService.baseMaps.OpenStreetMap]
      layers: [offlineMap],
      zoom: 15

    });


    //L.control.zoom({ position: "topright" }).addTo(this.map);
    L.control.scale({ imperial: dataSettings.units.imperial, metric: dataSettings.units.metric }).addTo(this.map);

    /* Point to reach **************************************/
    var marker = new L.Marker(this.center);
    this.map.addLayer(marker);

    marker.bindPopup(this.name);
    //marker.openPopup();

    /* map choice for map overlay *********************************************/
    //TODO https://geoservices.ign.fr/
    //http://leaflet-extras.github.io/leaflet-providers/preview/
    var baseMap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')//.addTo(this.map);

    var outdoorv9Map = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2pjeWdjY2NjZ3ljIiwiYSI6ImNqYWQwOWd3ZzFneDIyeXA4bnN3Mzk3bnIifQ.m3R9eKoZz4FJT2lw3gLDrA')//.addTo(this.map);

    var thunderforestMap = L.tileLayer('http://a.tile.thunderforest.com/landscape/{z}/{x}/{y}.png')//.addTo(this.map);

    var thunderForestCycleMap = L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png')//.addTo(this.map);

    var stamenMap = L.tileLayer('http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg')//.addTo(this.map);

    var hikeBikeMap = L.tileLayer('http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png')//.addTo(this.map);


    /* set of markers for map overlay *********************************************/
    var mk2 = L.marker([45.73990626, 6.12767908]).bindPopup('fake place1')
    var mk3 = L.marker([45.74049449, 6.12726955]).bindPopup('fake place2')
    var mfp = L.layerGroup([mk2, mk3]);

    var overlayMap = {
      "baseMap": baseMap,
      "Outdoor map": outdoorv9Map,
      "Forest map": thunderforestMap,
      "Cycle map": thunderForestCycleMap,
      "Hike & Bike map": hikeBikeMap,
      "stamenMap": stamenMap,
      "My favorite places": mfp
    };

    L.control.layers(onLineMaps, overlayMap).addTo(this.map);

    this.createEasyButtons(this)

  }

  createEasyButtons(this_: any) {
    //NOTE : this_ for giving scope

    /* NOTE asyButton : https://github.com/CliffCloud/Leaflet.EasyButton
    In case of typing problems
    https://stackoverflow.com/questions/37614323/how-to-include-leaflet-routing-machine-into-angular-2-typescript-webpack-applica/37694849#37694849
    https://stackoverflow.com/questions/42380525/how-to-import-leaflet-routing-machine-into-an-ionic2-project

    */

    // simple popup example
    /*
        var helloPopup = L.popup().setContent('Hello World!');
        L.easyButton('A', function(btn, map) {
          helloPopup.setLatLng([45.744572,6.134457]).openOn(map);
          //alert(btn+ "____"+ map);
        }).addTo(this.map);
        */

    var localisationButton = L.easyButton({
      states: [{
        stateName: 'start-localisation',        // name the state
        icon: 'ion-map-icon ion-map-icon-off ion-md-locate',// and define its properties
        title: 'Start localisation',      // like its title
        onClick: function(btn, map) {       // and its callback
          this_.startTracking();
          btn.state('stop-localisation');    // change state on click!
        }
      }, {
        stateName: 'stop-localisation',
        icon: 'ion-map-icon ion-map-icon-on ion-md-locate',
        title: 'Stop localisation',
        onClick: function(btn, map) {
          this_.stopTracking();
          btn.state('start-localisation');
        }
      }]
    });
    localisationButton.addTo(this.map)

    // showInfo btn
    L.easyButton(
      'ion-map-icon  ion-md-information', //ion-md-walk ?
      function() {
        this_.showTrackingNfo();
      },
      'Show Informations'
    ).addTo(this.map);

    var compassButton = L.easyButton({
      states: [{
        stateName: 'start-compass',        // name the state
        icon: 'ion-map-icon ion-map-icon-off ion-md-compass ', // TODO ion-ios
        title: 'Start compass',      // like its title
        onClick: function(btn, map) {       // and its callback

          this_.compassStarted = true;
          btn.state('stop-compass');    // change state on click!
        }
      }, {
        stateName: 'stop-compass',
        icon: 'ion-map-icon ion-map-icon-on ion-md-compass',
        title: 'Stop compass',
        onClick: function(btn, map) {
          this_.compassStarted = false;
          btn.state('start-compass');
        }
      }]
    });
    compassButton.addTo(this.map)

  }

  /* Locate user ***********************************************************/

  startTracking() {
    console.log("startTracking")

    this.events.subscribe('position:updated', (_lat, _lng) => {
      this.showMyPosition(_lat, _lng);

    });

    this.locationTracker.startTracking();

    //TODO show altitude

  }

  stopTracking() {

    this.events.unsubscribe('position:updated');
    this.locationTracker.stopTracking();

  }

  showMyPosition(_lat: number, _lng: number) {

    this.rtLat = _lat;
    this.rtLng = _lng;
    this.rtGeoCalls++;

    if (this.map.hasLayer(this.rtMk)) {
      this.map.removeLayer(this.rtMk);
    }

    this.rtMk = L.marker([_lat, _lng], { icon: this.rtIcon });
    this.map.addLayer(this.rtMk);

    //NOTE tooltip otions :https://github.com/Leaflet/Leaflet/blob/master/debug/map/tooltip.html
    this.rtMk.bindTooltip('You are here !', { sticky: true, direction: 'top' });

    //let the view includes both currentPosition and point to reach
    this.map.fitBounds([[_lat, _lng], this.center], { padding: [50, 50] });

  }

  /* UTILS *****************************************************************/
  getDistance() {
    return this.map.distance([this.rtLat, this.rtLng], this.center);

  }

  showTrackingNfo() {

    //TODO btn shwo info visible que si location tracker is watching

    let alert = this.alertCtrl.create({
      title: 'Mes infos de tracking non maj:',
      subTitle: 'Latitude : ' + this.rtLat + '<br>Longitude : ' + this.rtLng + '<br>Nombre geocalls : ' + this.rtGeoCalls + '<br>Distance entre les deux points : ' + this.getDistance(),
      buttons: ['OK']
    });
    alert.present();

  }

}
