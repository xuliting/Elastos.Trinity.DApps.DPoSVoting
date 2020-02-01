import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/services/nodes.service';
import { Node } from 'src/app/models/nodes.model';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {

  // Initial Values
  public _nodes: Node[] = [];
  public totalVotes: number = 0;
  public votePercent: number = 0;
  public inflationPercent: number = 0;
  public nodesLoaded: boolean = true;

  // Fetch api state
  private subscription: any = null;

  constructor(private nodesService: NodesService) { }

  ngOnInit() {
    this._nodes = this.nodesService.nodes;
    this.totalVotes = this.nodesService.totalVotes;;
    this.getVotePercent();
    if (this._nodes.length === 0) {
      this.nodesLoaded = false;
      this.subscription = this.nodesService.fetchCurrentHeight()
        .then(() => {
          this.subscription = this.nodesService.fetchNodes().subscribe(() => {
            this.subscription = null;
            this.nodesLoaded = true;
            this._nodes = this.nodesService.nodes;
            this.totalVotes = this.nodesService.totalVotes;
            this.getVotePercent();
            // this.getInflation();
          });
        })
        .catch(err => console.log('Cannot retrieve data', err));
    }
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  //// Define Values ////
  getVotePercent() {
    this.votePercent = this.totalVotes / (17851129 * 36) * 100;
  }

  fixTotalVotes(): string {
    return this.totalVotes.toLocaleString().split(/\s/).join(',');
  }

  getActiveNodes(): number {
    let activeNodes: number = 0;
    this._nodes.map(node => {
      if (node.State === 'Active') {
        activeNodes++;
      }
    });
    return activeNodes;
  }

 /*  getInflation() {
    let totalRewards = 0;
    this._nodes.map(node => {
      totalRewards += parseInt(node.EstRewardPerYear);
    });
    console.log('Total rewards ' + totalRewards);
    this.inflationPercent = totalRewards / 17132144;
  } */

   /* getTotalEla(): string {
    let ElaVotes: number = Math.ceil(this.totalVotes / 36);
    return ElaVotes.toLocaleString().split(/\s/).join(',');
  } */
}
