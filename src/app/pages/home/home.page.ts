import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/services/nodes.service';

declare let appManager: any;

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

  constructor(private nodesService: NodesService) {
  }

  ngOnInit() {}

  // appManager
  closeApp() {
    appManager.close();
  }
}
