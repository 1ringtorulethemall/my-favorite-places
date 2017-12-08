import { Injectable } from '@angular/core';

import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';
import { Events } from 'ionic-angular';

import { dataSettings } from '../../pages/settings/dataSettings';

@Injectable()
export class OrientationTrackerProvider {

  public watch: any;

  constructor(private deviceOrientation: DeviceOrientation, public events: Events) {  }

  startTracking() {

    const options = { frequency: dataSettings.compass.frequency };

    this.watch = this.deviceOrientation.watchHeading(options).subscribe(
      (data3: DeviceOrientationCompassHeading) => {
        this.events.publish('orientation:updated', data3.magneticHeading)
      }
      , (error: any) => {
        console.log(error + "err")
      });
  };

  stopTracking() { this.watch.unsubscribe(); };
}
