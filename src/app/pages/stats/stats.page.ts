import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/services/nodes.service';
import { Node } from 'src/app/models/nodes.model';

declare let appManager: any;

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {

  subscription: any;
  _nodes: Node[] = [];
  totalVotes: number = 0;
  votePercent: number = 0;
  nodesLoaded: boolean = true;

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
      });
    }
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  getTotalVotes() {
    this.nodesService.nodes.map(node => {
      this.totalVotes += parseInt(node.Votes);
    });
    this.votePercent = this.totalVotes / (16063887 * 36) * 100;
  }

  // Modify Values
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

  getTotalEla(): string {
    let ElaVotes: number = Math.ceil(this.totalVotes / 36);
    return ElaVotes.toLocaleString().split(/\s/).join(',');
  }
}
