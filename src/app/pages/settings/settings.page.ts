import { Component, OnInit } from '@angular/core';

declare let appService: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  closeApp() {
    appService.close();
  }

}
