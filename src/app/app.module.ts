import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { LocationTrackerProvider } from '../shared/providers/location-tracker';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';
import { OrientationTrackerProvider } from '../shared/providers/orientation-tracker';
import { CompassComponent } from "../components/compass/compass";

import { Camera } from '@ionic-native/camera';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthProvider } from '../shared/providers/auth';

import { environment } from '../environments/environment';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { NewLocalisationPage } from '../pages/new-localisation/new-localisation';

import { SettingsPage } from '../pages/settings/settings';
import { PlacePage } from '../pages/place/place';
import { MapOsmPage } from '../pages/map/osm/map-osm';
import { MapGooglePage } from '../pages/map/google/map-google';

import { TruncatePipe } from '../shared/pipes/truncate-pipe';

import { Insomnia } from '@ionic-native/insomnia';


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    NewLocalisationPage,
    SettingsPage,
    PlacePage,
    MapOsmPage,
    MapGooglePage,
    CompassComponent,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(), // Offline sync
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    NewLocalisationPage,
    SettingsPage,
    PlacePage,
    MapOsmPage,
    MapGooglePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LocationTrackerProvider,
    BackgroundGeolocation,
    Geolocation,
    DeviceOrientation,
    OrientationTrackerProvider,
    Insomnia,
    Camera,
    AuthProvider
  ]
})
export class AppModule { }
