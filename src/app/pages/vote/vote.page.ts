import { Component, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';

import { NodesService } from 'src/app/nodes.service';

declare let appService: any;

@Component({
  selector: 'app-vote',
  templateUrl: './vote.page.html',
  styleUrls: ['./vote.page.scss'],
})
export class VotePage implements OnInit {

  homeActive = true;
  votingActive = false;
  statsActive = false;

  constructor(private nodesService: NodesService) {}

  ngOnInit() {
    this.nodesService.fetchCurrentHeight();
  }

  showHome() {
    this.homeActive = true;
    this.votingActive = false;
    this.statsActive = false;
  }

  showVote() {
    this.homeActive = false;
    this.votingActive = true;
    this.statsActive = false;
  }

  showStats() {
    this.homeActive = false;
    this.votingActive = false;
    this.statsActive = true;
  }

  _showVote(bool: boolean) {
    this.homeActive = false;
    this.votingActive = bool;
    this.statsActive = false;
  }

  toggleComponent(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }

  closeApp() {
    appService.close();
  }

}
