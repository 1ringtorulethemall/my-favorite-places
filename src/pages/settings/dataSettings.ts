export const dataSettings = {
  geolocation: {
    foreground: true,
    background: false
  },
  maps: {
    osm: true, //open street map via leaflet
    google: false
  },
  image: {
    width: 592,
    height: 333
  },
  language: {
    fr: true,
    en: false
  },
  units: {
    metric: true,
    imperial: false
  },
  compass: {
    frequency: 300
  },
  global: {
    insomnia: false
  },
  categories :[
    { text: 'Champignons', value: 'champignons' },
    { text: 'Arbres remarquables', value: 'arbresremarquables' },
    { text: 'Coin à châtaignes', value: 'Coin à châtaignes' },
    { text: 'Myrtilles', value: 'myrtilles' },
    { text: 'Fourre-tout', value: 'fourre-tout' },
    { text: 'Passage de cerfs', value: 'Passage de cerfs' }
  ]
};
