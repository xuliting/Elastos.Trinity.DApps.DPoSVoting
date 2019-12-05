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
        this.getTotalVotes();
        this.nodesService.getNodeIcon();
        this.getStoredNodes();
      });
    }
  }

  /* ionViewDidLeave() {
    this.showNode = false;
  } */

  ionViewWillEnter() {
    this._nodes = this.nodesService.nodes;
  }

  getTotalVotes() {
    this._nodes.map(node => {
      this.totalVotes += parseFloat(node.Votes);
    });
    console.log('Total Votes -> ' + this.totalVotes);
  }

  // storage
  getStoredNodes() {
    this.storageService.getNodes().then(data => {
      console.dir(data);
      if(data.length !== 0) {
        this._nodes.map(node => {
          data.map(key => {
            if (key === node.Ownerpublickey) {
              node.isChecked === true;
            }
          })
        })
      } else return
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
      { publickeys: JSON.stringify(castedNodeKeys) },
      () => {
        console.log('Insent sent sucessfully');
        this.storageService.setNodes(castedNodeKeys);
        this.castingVote = false;
      }, (err) => {
        console.log('Intent sending failed', err);
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

  getVotePercent(votes): string {
    const votePercent: number = parseFloat(votes) / this.totalVotes * 100;
    return votePercent.toFixed(2);
  }

  // Node Detail
  _showNode(index: number, node) {
    if (index >= 5) {
      this.slideArray = this._nodes.slice(index - 5, index + 5);
      this.nodeIndex = this.slideArray.indexOf(node);
    }
    if (index < 5) {
      this.slideArray = this._nodes.slice(0, 10);
      this.nodeIndex = this.slideArray.indexOf(node);
    }
    this.showNode = !this.showNode;
  }
}



