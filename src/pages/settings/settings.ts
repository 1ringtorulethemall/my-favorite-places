import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  brightness: number = 20;
  contrast: number = 0;
  warmth: number = 1300;
  structure: any = { lower: 33, upper: 60 };
  text: number = 0;

  langs;
  langForm;

  constructor() {
    this.langForm = new FormGroup({
      "maps": new FormControl(
        //{ value: 'osm', disabled: false }
      )
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  /* MAPS ******************************************************************/
  doSubmit(event) {
    console.log('Submitting form', this.langForm.value);
    event.preventDefault();
  }

}
