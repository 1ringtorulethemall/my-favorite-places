import { Component } from '@angular/core';
import { NavController, AlertController  } from 'ionic-angular';


@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {

  constructor(public alertCtrl: AlertController) {  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPage');
  }

}
