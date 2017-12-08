# My-favorites-places v0.0.1 work in progress

Ionic 3.18.0
Node 6.11.2
angular 5.0.1
typescript 2.4.2

## How to continue
git clone
npm install

npm install leaflet --save
npm install leaflet-offline --save

ionic cordova plugin add cordova-plugin-geolocation
npm install --save @ionic-native/geolocation

ionic cordova plugin add cordova-plugin-mauron85-background-geolocation
npm install --save @ionic-native/background-geolocation

ionic cordova plugin add cordova-plugin-camera
npm install --save @ionic-native/camera

npm install angularfire2 firebase

ionic cordova plugin add cordova-plugin-device-orientation
npm install --save @ionic-native/device-orientation

ionic cordova plugin add cordova-plugin-insomnia
npm install --save @ionic-native/insomnia

(See package.json or config.xml for ^~= plugins versions )

### Please set your firebase configuration in `environment.ts`

// Initialize Firebase
```javascript
firebase: {
  apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  authDomain: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  databaseURL: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  projectId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  storageBucket: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  messagingSenderId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
};
```

### Camera testing inside browser
ionic cordova run browser
