import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/nodes.service';
import { Node } from 'src/app/nodes.model';
import { StorageService } from 'src/app/storage.service';

declare let appManager: any;

@Component({
  selector: 'app-vote',
  templateUrl: './vote.page.html',
  styleUrls: ['./vote.page.scss'],
})
export class VotePage implements OnInit {

  // Initial Values
  _nodes: Node[] = [];
  totalVotes: number = 0;
  nodesLoaded: boolean = true;

  // Intent
  activeVotes: number = 0;
  elaAmount: number = 5000;
  castingVote: boolean = false;

  selectedNodes: Node[] = [];

  // Node Detail
  showNode: boolean = false;
  nodeIndex: number;
  slideArray: Node[] = [];

  constructor(
    private nodesService: NodesService,
    private storageService: StorageService,
  ) {
  }

  ngOnInit() {
    this._nodes = this.nodesService.nodes;
    this.getTotalVotes();
    this.getStoredNodes();
    if (this._nodes.length === 0) {
      this.nodesLoaded = false;
      this.nodesService.fetchNodes().subscribe(nodes => {
        this.nodesLoaded = true;
        this._nodes = nodes.result;
        console.log('Nodes from Voting ->', this._nodes);
        this.nodesService.getNodeIcon();
        this.getTotalVotes();
        this.getStoredNodes();
      });
    }
  }

  ionViewDidLeave() {
    this.castingVote = false;
  }

  ionViewWillEnter() {
    this._nodes = this.nodesService.nodes;
  }

  getTotalVotes() {
    this._nodes.map(node => {
      this.totalVotes += parseFloat(node.Votes);
    });
    console.log('Total Votes -> ' + this.totalVotes);
  }

  // Storage
  getStoredNodes() {
    this.storageService.getNodes().then(data => {
      console.log(data);
      this.nodesService.nodes.map(node => {
        if (data.includes(node.Ownerpublickey)) {
          node.isChecked === true;
          this.selectedNodes = this.selectedNodes.concat(node);
          console.log(this.selectedNodes);
        }
      })
    });
  }

  // appManager
  castVote() {
    let castedNodeKeys = [];
    this._nodes.map(node => {
      if(node.isChecked === true) {
        castedNodeKeys = castedNodeKeys.concat(node.Ownerpublickey);
        this.castingVote = true;
      }
    });
    console.log(castedNodeKeys);
    appManager.sendIntent(
      'dposvotetransaction',
      { publickeys: (castedNodeKeys) },
      () => {
        console.log('Insent sent sucessfully');
        this.storageService.setNodes(castedNodeKeys);
        this.castingVote = false;
      }, (err) => {
        console.log('Intent sending failed', err);
        this.castingVote = false;
      }
    );
  }

  closeApp() {
    appManager.close();
  }

  // Modify Values
  getVotes(votes): string {
    const fixedVotes: number = parseInt(votes);
    return fixedVotes.toLocaleString().split(/\s/).join(',');
  }

  getSelectedNodes(): number {
    let addedNodes: number = 0;
    this.nodesService.nodes.map(node => {
      if (node.isChecked === true) {
        addedNodes++;
      }
    });
    return addedNodes;
  }


 /*  getSelectedNodes(): number {
    this.nodesService.nodes.map(node => {
      if (node.isChecked === true) {
        this.selectedNodes = this.selectedNodes.concat(node);
      }
    });
    let addedNodes = this.selectedNodes.filter((a, b) => this.selectedNodes.indexOf(a) === b);
    return addedNodes.length;
  } */

  getVotePercent(votes): string {
    const votePercent: number = parseFloat(votes) / this.totalVotes * 100;
    return votePercent.toFixed(2);
  }

  // Node Detail - Short Array
  /* _showNode(index: number, node) {
    if (index >= 10) {
      this.slideArray = this._nodes.slice(index - 10, index + 10);
      this.nodeIndex = this.slideArray.indexOf(node);
    }
    if (index < 10) {
      this.slideArray = this._nodes.slice(0, 20);
      this.nodeIndex = this.slideArray.indexOf(node);
    }
    this.showNode = !this.showNode;
  } */

  // Node Detail - Long Array
  _showNode(index) {
    this.showNode = !this.showNode;
    this.nodeIndex = index;
  }

  return() {
    this.showNode = false;
  }
}




