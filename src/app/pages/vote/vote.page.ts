import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { NodesService } from 'src/app/services/nodes.service';
import { Node } from 'src/app/models/nodes.model';
import { StorageService } from 'src/app/services/storage.service';

declare let appManager: any;

@Component({
  selector: 'app-vote',
  templateUrl: './vote.page.html',
  styleUrls: ['./vote.page.scss'],
})
export class VotePage implements OnInit {

  // Initial Values
  subscription: any;
  _nodes: Node[] = [];
  totalVotes: number = 0;
  nodesLoaded: boolean = true;

  // Intent
  elaAmount: number = 5000;
  castingVote: boolean = false;

  // Node Detail
  showNode: boolean = false;
  nodeIndex: number;
  node: Node;

  constructor(
    private nodesService: NodesService,
    private storageService: StorageService,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.nodesLoaded = true;
    this._nodes = this.nodesService.nodes;
    this.getTotalVotes();
    if (this._nodes.length === 0) {
      this.nodesLoaded = false;
      this.nodesService.fetchCurrentHeight()
        .then(() => {
          this.subscription = this.nodesService.fetchNodes().subscribe(nodes => {
            this.nodesLoaded = true;
            this._nodes = nodes.result;
            this.nodesService.getNodeIcon();
            this.nodesService.getStoredNodes();
            this.getTotalVotes();
          });
        })
        .catch(err => console.log('Cannot retrieve data', err));
    }
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    this.castingVote = false;
  }

  ionViewWillEnter() {
    this._nodes = this.nodesService.nodes;
  }

  async voteSuccess(res) {
    const toast = await this.toastController.create({
      mode: 'ios',
      header: 'Votes successfully sent',
      message: 'Txid:' + res,
      color: "primary",
      cssClass: 'toaster',
      duration: 4000,
    });
    toast.present().then(() => {
      this.castingVote = false;
    })
  }

  async voteFailed(res) {
    const toast = await this.toastController.create({
      mode: 'ios',
      header: 'There was an error with sending votes..',
      message: res,
      color: "primary",
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.castingVote = false;
          }
        }
      ]
    });
    toast.present();
  }

  async noNodesChecked() {
    const toast = await this.toastController.create({
      message: 'Please select up to 36 nodes in order to vote',
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  getTotalVotes() {
    this._nodes.map(node => {
      this.totalVotes += parseFloat(node.Votes);
    });
  }

  // appManager
  castVote() {
    let castedNodeKeys = [];
    this._nodes.map(node => {
      if (node.isChecked === true) {
        castedNodeKeys = castedNodeKeys.concat(node.Ownerpublickey);
      }
    });
    if (castedNodeKeys.length > 0) {
      console.log(castedNodeKeys);
      this.castingVote = true;
      appManager.sendIntent(
        'dposvotetransaction',
        { publickeys: (castedNodeKeys) },
        (res) => {
          console.log('Insent sent sucessfully', res);
          this.storageService.setNodes(castedNodeKeys);
          if(res.result.txid === null ) {
            this.voteFailed('Txid returned null');
          } else {
            this.voteSuccess(res.result.txid);
          }
        }, (err) => {
          console.log('Intent sending failed', err);
          this.voteFailed(err);
        }
      );
    } else {
      this.noNodesChecked();
    }
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
    this._nodes.map(node => {
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
  _showNode(index, node) {
    this.showNode = !this.showNode;
    this.nodeIndex = index;
    this.node = node;
  }

  return() {
    this.showNode = false;
  }
}


