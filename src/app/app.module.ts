import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Camera } from '@ionic-native/camera';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from '../environments/environment';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { NewLocalisationPage } from '../pages/new-localisation/new-localisation';
import { NotesPage } from '../pages/notes/notes';

import { SettingsPage } from '../pages/settings/settings';
import { PlacePage } from '../pages/place/place';
import { MapPage } from '../pages/map/map';



@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    NewLocalisationPage,
    NotesPage,
    SettingsPage,
    PlacePage,
    MapPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence() // Offline sync
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    NewLocalisationPage,
    NotesPage,
    SettingsPage,
    PlacePage,
    MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LocationTrackerProvider,
    BackgroundGeolocation,
    Geolocation,
    Camera
  ]
})
export class AppModule { }
