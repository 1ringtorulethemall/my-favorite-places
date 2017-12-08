import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import { OrientationTrackerProvider } from '../../shared/providers/orientation-tracker';

@Component({
  selector: 'compass',
  templateUrl: 'compass.html'
})
export class CompassComponent {

  rTransform: string = "rotate(0deg)";
  magneticHeading: number = 0;

  constructor(public orientationTracker: OrientationTrackerProvider, public events: Events) { }

  ngOnInit() { this.startOrientationTracking(); }
  startOrientationTracking() {
    let angle: number;
    this.events.subscribe('orientation:updated', (_orientation) => {
      angle = Math.round(_orientation);
      this.rTransform = "rotate(" + angle.toString() + "deg)";
      this.magneticHeading = angle;
    });
    this.orientationTracker.startTracking();

  }

  ngOnDestroy() { this.stopOrientationTracking() }
  stopOrientationTracking() {
    this.events.unsubscribe('orientation:updated');
    this.orientationTracker.stopTracking();
  }

}
