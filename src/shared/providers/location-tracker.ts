import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';//provides foreground and background geolocation with battery-saving "circular region monitoring" and "stop detection"
import 'rxjs/add/operator/filter';

import { dataSettings } from '../../pages/settings/dataSettings';

import { Events } from 'ionic-angular';

@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  public isWatching: boolean = false;
  public lat: number = 0;
  public lng: number = 0;
  public alt: number = 0;

  constructor(public zone: NgZone, public events: Events, public bgGeolocation: BackgroundGeolocation, public geolocation: Geolocation) { }

  startTracking() {

    this.isWatching = true;

    if (dataSettings.geolocation.background) {
      // Background Tracking
      //TODO: ajuster config
      let config = {
        desiredAccuracy: 0,
        stationaryRadius: 20,
        distanceFilter: 10,
        debug: false, //  enable this hear sounds for background-geolocation life-cycle.
        interval: 2000,
        stopOnTerminate: true, // enable this to clear background location settings when the app terminates
      };

      this.bgGeolocation.configure(config).subscribe((location) => {

        // Run update inside of Angular's zone
        this.zone.run(() => {
          this.lat = location.latitude;
          this.lng = location.longitude;
          this.alt = location.altitude;

          this.events.publish('position:updated', location.latitude, location.longitude)

        });

      }, (err) => {

        console.log(err);

      });

      // Turn ON the background-geolocation system.
      this.bgGeolocation.start();

    }

    if (dataSettings.geolocation.foreground) {
      // Foreground Tracking
      //TODO: ajuster config
      let options = {
        frequency: 3000,
        enableHighAccuracy: true
      };

      this.watch = this.geolocation.watchPosition(options)
        .filter((p: any) => p.code === undefined)
        .subscribe((position: Geoposition) => {

          // Run update inside of Angular's zone
          this.zone.run(() => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.alt = position.coords.altitude;

            //TODO for both background and foreground
            //position.coords.speed ...

            this.events.publish('position:updated', position.coords.latitude, position.coords.longitude)

          });

        });
    }

  }

  stopTracking() {
    this.isWatching = false;
    this.bgGeolocation.finish();
    this.watch.unsubscribe();
  }

  resetDatas() {
    this.lat = 0;
    this.lng = 0;
    this.alt = 0;
  }

}
