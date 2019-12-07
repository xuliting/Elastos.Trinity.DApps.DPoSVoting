import { Component, OnInit } from '@angular/core';

declare let appManager: any;

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // appManager
  closeApp() {
    appManager.close();
  }
}
