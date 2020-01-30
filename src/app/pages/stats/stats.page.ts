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
    this.getTotalVotes();
    if (this._nodes.length === 0) {
      this.nodesLoaded = false;
      this.subscription = this.nodesService.fetchNodes().subscribe(nodes => {
        this.nodesLoaded = true;
        this._nodes = nodes.result;
        this.nodesService.getNodeIcon();
        this.nodesService.getStoredNodes();
        this.getTotalVotes();
        // this.getInflation();
        this.subscription = null;
      });
    }
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getTotalVotes() {
    this._nodes.map(node => {
      this.totalVotes += parseInt(node.Votes);
    });
    this.votePercent = this.totalVotes / (17132144 * 36) * 100;
  }

  //// Define Values ////
  getActiveNodes(): number {
    let activeNodes: number = 0;
    this._nodes.map(node => {
      if (node.State === 'Active') {
        activeNodes++;
      }
    });
    return activeNodes;
  }

  fixTotalVotes(): string {
    return this.totalVotes.toLocaleString().split(/\s/).join(',');
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
