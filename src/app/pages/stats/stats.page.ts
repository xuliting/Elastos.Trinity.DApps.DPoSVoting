import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/nodes.service';
import { Node } from 'src/app/nodes.model';

declare let appManager: any;

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {

  totalVotes: number = 0;
  votePercent: number = 0;
  _nodes: Node[] = [];
  nodesLoaded: boolean = true;

  constructor(private nodesService: NodesService) { }

  ngOnInit() {
    this._nodes = this.nodesService.nodes;
    this.getTotalVotes();
    if (this._nodes.length === 0) {
      this.nodesLoaded = false;
      this.nodesService.fetchNodes().subscribe(nodes => {
        this.nodesLoaded = true;
        this._nodes = nodes.result;
        console.log('Nodes from Stats ->', this._nodes);
        this.getTotalVotes();
        this.nodesService.getNodeIcon();
      });
    }
  }

  getTotalVotes() {
    this._nodes.map(node => {
      this.totalVotes += parseInt(node.Votes);
    });
    console.log('Total Votes -> ' + this.totalVotes);
    this.votePercent = this.totalVotes / (16063887 * 36) * 100;
  }

  // appManager
  closeApp() {
    appManager.close();
  }

  // modify data
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
