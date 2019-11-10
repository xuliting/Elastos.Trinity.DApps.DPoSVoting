import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/nodes.service';
import { Node } from 'src/app/nodes.model';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {

  totalVotes = 0;
  votePercent = 0;
  _nodes: Node[];
  nodesLoaded = true;

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

  // helpers
  getActiveNodes() {
    let activeNodes = 0;
    this._nodes.map(node => {
      if (node.State === 'Active') {
        activeNodes++;
      }
    });
    return activeNodes;
  }
}
