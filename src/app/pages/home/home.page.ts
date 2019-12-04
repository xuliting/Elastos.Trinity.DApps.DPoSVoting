import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

import { NodesService } from 'src/app/nodes.service';
import { Node } from 'src/app/nodes.model';

declare let appManager: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('slider', {static: true})  slides: IonSlides;

  // Initial Values
  _nodes: Node[] = [];
  totalVotes: number = 0;
  nodesLoaded: boolean = false;

  // Other Values
  activeNodes: number = 0;
  activeVotes: number = 0;
  elaAmount: number = 5000;

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

  ngOnInit() {
    this.nodesLoaded = true;
    this._nodes = this.nodesService.nodes;
    this.getTotalVotes();
    if (this._nodes.length === 0) {
      this.nodesLoaded = false;
      this.nodesService.fetchCurrentHeight()
        .then(() => {
          this.nodesService.fetchNodes().subscribe(nodes => {
            this.nodesLoaded = true;
            this._nodes = nodes.result;
            console.log('Nodes from Home ->', this._nodes);
            this.getTotalVotes();
            this.nodesService.getNodeIcon();
          });
        })
        .catch(err => console.log('Cannot retrieve data', err));
    }
  }

  getTotalVotes() {
    this._nodes.map(node => {
      this.totalVotes += parseInt(node.Votes);
      if(node.State === 'Active') {
        this.activeNodes++;
      }
    });
  }

  // appManager
  closeApp() {
    appManager.close();
  }

  // Modify Values
  getTotalEla(): string {
    let ElaVotes: number = Math.ceil(this.totalVotes / 36);
    return ElaVotes.toLocaleString().split(/\s/).join(',');
  }
}
