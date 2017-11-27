import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { NewLocalisationPage } from '../new-localisation/new-localisation';
import { NotesPage } from '../notes/notes';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html',
})

export class TabsPage {

  tab1Root = HomePage;
  tab2Root = NewLocalisationPage;
  tab3Root = NotesPage;
  tab4Root = SettingsPage;

}
