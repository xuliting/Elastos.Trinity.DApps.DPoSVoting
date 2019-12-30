import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { NodesService } from './services/nodes.service';

@Component({
  selector: 'my-app',
  templateUrl: 'app.html',
  styleUrls: ['./app.scss']
})
export class MyApp {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nodesService: NodesService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.nodesService.fetchCurrentHeight();
    });
  }
}
