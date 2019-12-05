import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/nodes.service';
import { Node } from 'src/app/nodes.model';

declare let appManager: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  // Initial Values
  _nodes: Node[] = [];
  filteredNodes: Node[] = [];
  totalVotes: number = 0;

  // Node Detail
  nodeIndex: number;
  nodesLoaded: boolean = true;
  showNode: boolean = false;

  constructor(
    private nodesService: NodesService,
  ) {}

  ngOnInit() {
    this._nodes = this.nodesService.nodes;
    this.getTotalVotes();
    if (this._nodes.length === 0) {
      this.nodesLoaded = false;
      this.nodesService.fetchNodes().subscribe(nodes => {
        this.nodesLoaded = true;
        this._nodes = nodes.result;
        console.log('Nodes from Voting ->', this._nodes);
        this.getTotalVotes();
        this.nodesService.getNodeIcon();
      });
    }
  }

  /* ionViewDidLeave() {
    this.showNode = false;
  } */

  getTotalVotes() {
    this._nodes.map(node => {
      this.totalVotes += parseFloat(node.Votes);
    });
    console.log('Total Votes -> ' + this.totalVotes);
  }

  // Search
  filterNodes(search): any {
    this.filteredNodes = this._nodes.filter((node) => {
      if (!search) {
        return;
      } else {
        return node.Nickname.toLowerCase().indexOf(search.toLowerCase()) !== -1;
      }
    });
    console.log(this.filteredNodes);
  }

  // appManager
  closeApp() {
    appManager.close();
  }

  // Modify Values
  getVotes(votes): string {
    const fixedVotes: number = parseInt(votes);
    return fixedVotes.toLocaleString().split(/\s/).join(',');
  }

  getVotePercent(votes): string {
    const votePercent: number = parseFloat(votes) / this.totalVotes * 100;
    return votePercent.toFixed(2);
  }

  // Node Detail
  _showNode(index) {
    this.showNode = !this.showNode;
    this.nodeIndex = index;
  }
}
