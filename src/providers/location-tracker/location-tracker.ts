import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';//provides foreground and background geolocation with battery-saving "circular region monitoring" and "stop detection"
import 'rxjs/add/operator/filter';

@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  public isWatching: boolean = false;
  public lat: number = 0;
  public lng: number = 0;
  public alt: number = 0;

  constructor(public zone: NgZone, public bgGeolocation: BackgroundGeolocation, public geolocation: Geolocation) { }

  startTracking() {

    this.isWatching = true;

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

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
        this.alt = location.altitude;
      });

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    this.bgGeolocation.start();


    // Foreground Tracking
    //TODO: ajuster config
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      console.log(position);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.alt = position.coords.altitude;
      });

    });

  }

  stopTracking() {
    this.isWatching = false;

    this.bgGeolocation.finish();
    this.watch.unsubscribe();
  }

}
