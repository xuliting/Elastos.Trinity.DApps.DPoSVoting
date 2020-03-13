import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  // slider
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  next(slide) {
    slide.slideNext();
  }

  prev(slide) {
    slide.slidePrev();
  }

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {
  }

  ngOnInit() {}

  ionViewDidEnter() {
    appManager.setVisible("show");
    titleBarManager.setBackgroundColor("#8FDFFF");
    titleBarManager.setTitle('DPoS Voting');
  }

  goToVote() {
    this.storageService.setVisit(true);
    this.router.navigate(['menu/vote']);
  }

  // appManager
  closeApp() {
    appManager.close();
  }
}
