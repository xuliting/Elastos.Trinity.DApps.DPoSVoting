import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

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
    public alertController: AlertController
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

  async voteSuccess() {
    const alert = await this.alertController.create({
      message: 'Votes sucessfully sent!',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.castingVote = false;
          }
        }
      ]
    });
    await alert.present();
  }

  async voteFailed() {
    const alert = await this.alertController.create({
      message: 'There was an error with sending votes..',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.castingVote = false;
          }
        }
      ]
    });
    await alert.present();
  }

  async noNodesChecked() {
    const alert = await this.alertController.create({
      message: 'Please select up to 36 nodes in order to vote',
      buttons: ['Okay']
    });
    await alert.present();
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
        () => {
          console.log('Insent sent sucessfully');
          this.storageService.setNodes(castedNodeKeys);
          this.voteSuccess();
        }, (err) => {
          console.log('Intent sending failed', err);
          this.voteFailed();
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


