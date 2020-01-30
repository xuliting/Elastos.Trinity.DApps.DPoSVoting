import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

import { NodesService } from 'src/app/services/nodes.service';
import { Node } from 'src/app/models/nodes.model';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild('search', {static: false}) search: IonInput;

  // Initial Values
  public _nodes: Node[] = [];
  public filteredNodes: Node[] = [];
  public _node: string = '';
  public totalVotes: number = 0;
  public nodesLoaded: boolean = true;

  // Node Detail
  public showNode: boolean = false;
  public nodeIndex: number;
  public node: Node;

  // Fetch api state
  private subscription: any = null;

  constructor(
    private nodesService: NodesService,
  ) {}

  ngOnInit() {
    this._nodes = this.nodesService.nodes.filter(node => node.State === 'Active');
    this.getTotalVotes();
    if (this._nodes.length === 0) {
      this.nodesLoaded = false;
      this.subscription = this.nodesService.fetchNodes().subscribe(nodes => {
        this.nodesLoaded = true;
        this._nodes = this._nodes.filter(node => node.State === 'Active');
        this.nodesService.getNodeIcon();
        this.nodesService.getStoredNodes();
        this.getTotalVotes();
        this.subscription = null;
      });
    }
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    }, 200);
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getTotalVotes() {
    this.nodesService.nodes.map(node => {
      this.totalVotes += parseFloat(node.Votes);
    });
  }

  //// Search ////
  filterNodes(search: string): any {
    this.filteredNodes = this._nodes.filter((node) => {
      if (!search) {
        return;
      } else {
        return node.Nickname.toLowerCase().indexOf(search.toLowerCase()) !== -1;
      }
    });
  }

  //// Define Values ////
  getVotes(votes): string {
    const fixedVotes: number = parseInt(votes);
    return fixedVotes.toLocaleString().split(/\s/).join(',');
  }

  getVotePercent(votes): string {
    const votePercent: number = parseFloat(votes) / this.totalVotes * 100;
    return votePercent.toFixed(2);
  }

  //// Node Detail ////
  _showNode(index: number, node: Node) {
    this.showNode = !this.showNode;
    this.nodeIndex = index;
    this.node = node;
  }

  return() {
    this.showNode = false;
  }
}
