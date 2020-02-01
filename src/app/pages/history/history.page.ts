import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { NodesService } from 'src/app/services/nodes.service';
import { Node } from 'src/app/models/nodes.model';
import { Vote } from 'src/app/models/history.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  // Initial values
  public _votes: Vote[] = [];
  public nodesLoaded: boolean = true;

  // Fetch api state
  private subscription: any = null;

  constructor(public nodesService: NodesService) { }

  ngOnInit() {
    if(this.nodesService.nodes.length === 0) {
      this.nodesLoaded = false;
      this.subscription = this.nodesService.fetchCurrentHeight()
        .then(() => {
            this.subscription = this.nodesService.fetchNodes().subscribe(() => {
              this.subscription = null;
              this.nodesLoaded = true;
            });
          })
        .catch(err => console.log('Cannot retrieve data', err));
    }
    console.log('Votes History', this.nodesService._votes);
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  modDate(date) {
    return moment(date).format("MMM Do YY, h:mm:ss a");
  }
}
