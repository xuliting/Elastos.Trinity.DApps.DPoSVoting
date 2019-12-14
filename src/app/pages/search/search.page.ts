import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

import { NodesService } from 'src/app/nodes.service';
import { Node } from 'src/app/nodes.model';

declare let appManager: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild('search', {static: false}) search: IonInput;

  // Initial Values
  subscription: any;
  _nodes: Node[] = [];
  filteredNodes: Node[] = [];
  _node: string = '';
  totalVotes: number = 0;
  nodesLoaded: boolean = true;

  // Node Detail
  showNode: boolean = false;
  nodeIndex: number;
  node: Node;

  constructor(
    private nodesService: NodesService,
  ) {}

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

  ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    }, 200);
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  getTotalVotes() {
    this._nodes.map(node => {
      this.totalVotes += parseFloat(node.Votes);
    });
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
  _showNode(index, node) {
    this.showNode = !this.showNode;
    this.nodeIndex = index;
    this.node = node;
  }

  return() {
    this.showNode = false;
  }
}
