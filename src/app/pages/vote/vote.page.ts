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
  public _nodes: Node[] = [];
  public totalVotes: number = 0;
  public nodesLoaded: boolean = true;

  // Intent
  public voted: boolean = false;

  // Node Detail
  public showNode: boolean = false;
  public nodeIndex: number;
  public node: Node;

  // Toast for voteFailed/voteSuccess
  private toast: any = null;

  // Fetch api state
  private subscription: any = null;

  constructor(
    private nodesService: NodesService,
    private storageService: StorageService,
    private toastController: ToastController
  ) {
  }

  ngOnInit() {
    this._nodes = this.nodesService.nodes.filter(node => node.State === 'Active');
    this.getTotalVotes();

    if (this._nodes.length === 0) {
      this.nodesLoaded = false;
      this.nodesService.fetchCurrentHeight()
        .then(() => {
          this.subscription = this.nodesService.fetchNodes().subscribe(nodes => {
            this.subscription = null;
            this.nodesLoaded = true;
            this._nodes = nodes.result;
            this._nodes = this._nodes.filter(node => node.State === 'Active');

            this.nodesService.getNodeIcon();
            this.nodesService.getStoredNodes();
            this.getTotalVotes();
          });
        })
        .catch(err => console.log('Cannot retrieve data', err));
    }
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

  //// Vote intent ////
  castVote() {
    let castedNodeKeys = [];
    this._nodes.map(node => {
      if (node.isChecked === true) {
        castedNodeKeys = castedNodeKeys.concat(node.Ownerpublickey);
      }
    });

    if (castedNodeKeys.length > 0) {
      console.log(castedNodeKeys);
      let votesSent: boolean = false;

      appManager.sendIntent(
        'dposvotetransaction',
        { publickeys: (castedNodeKeys) },
        {},
        (res) => {
          console.log('Insent sent sucessfully', res);
          this.storageService.setNodes(castedNodeKeys);

          if(res.result.txid === null ) {
            votesSent = true;
            this.voteFailed('Votes were cancelled');
          } else {
            votesSent = true;
            this.voted = true;
            let date = new Date;
            let txid: string = res.result.txid;

            this.nodesService._votes = this.nodesService._votes.concat({ date: date, tx: txid, keys: castedNodeKeys });
            console.log('Vote history updated', this.nodesService._votes);
            this.storageService.setVotes(this.nodesService._votes);
            this.voteSuccess(res.result.txid);
          }
        }, (err) => {
          votesSent = true;
          console.log('Intent sent failed', err);
          this.voteFailed(err);
        }
      );

      // If no response is sent from wallet, show vote transaction has failed
      setTimeout(() => {
        if(votesSent === false) {
          this.voteFailed('No response from wallet');
        }
      }, 10000)

    } else {
      this.noNodesChecked();
    }
  }

  //// Define Values ////
  getVotes(votes: string): string {
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

  getVotePercent(votes: string): string {
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

  //// Alerts ////
  async voteSuccess(res: string) {
    this.closeToast();
    this.toast = await this.toastController.create({
      mode: 'ios',
      header: 'Votes successfully sent',
      message: 'Txid:' + res.slice(0,30) + '...',
      color: "primary",
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.toast.dismiss();
          }
        }
      ],
    });
    this.toast.present();
  }

  async voteFailed(res: string) {
    this.closeToast();
    this.toast = await this.toastController.create({
      mode: 'ios',
      header: 'There was an error with sending votes...',
      message: res,
      color: "primary",
      cssClass: 'toaster',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.toast.dismiss();
          }
        }
      ]
    });
    this.toast.present();
  }

  // If we get response from sendIntent, we need to close the toast showed for timeout
  closeToast() {
    if (this.toast) {
      this.toast.dismiss();
      this.toast = null;
    }
  }

  async noNodesChecked() {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: 'Please select up to 36 nodes in order to vote',
      color: "primary",
      duration: 2000
    });
    toast.present();
  }
}


