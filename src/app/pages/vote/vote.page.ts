import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { NodesService } from 'src/app/services/nodes.service';
import { Node } from 'src/app/models/nodes.model';
import { StorageService } from 'src/app/services/storage.service';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-vote',
  templateUrl: './vote.page.html',
  styleUrls: ['./vote.page.scss'],
})
export class VotePage implements OnInit {

  // Values
  public selectedNodes: number = 0;

  // Intent
  public voted: boolean = false;

  // Node Detail
  public showNode: boolean = false;
  public nodeIndex: number;
  public node: Node;

  // Toast for voteFailed/voteSuccess
  private toast: any = null;

  constructor(
    public nodesService: NodesService,
    private storageService: StorageService,
    private toastController: ToastController
  ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
    titleBarManager.setBackgroundColor("#9D64FB");
    titleBarManager.setTitle('DPoS Voting');
  }

  //// Vote intent ////
  castVote() {
    let castedNodeKeys: string[] = [];
    this.nodesService._nodes.map(node => {
      if (node.isChecked === true) {
        castedNodeKeys = castedNodeKeys.concat(node.Ownerpublickey);
      }
    });

    if (castedNodeKeys.length > 0) {
      console.log(castedNodeKeys);
      this.storageService.setNodes(castedNodeKeys);
      let votesSent: boolean = false;

      appManager.sendIntent(
        'dposvotetransaction',
        { publickeys: (castedNodeKeys) },
        {},
        (res) => {
          console.log('Insent sent sucessfully', res);

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
    this.selectedNodes = 0;
    this.nodesService._nodes.map(node => {
      if (node.isChecked === true) {
        this.selectedNodes++;
      }
    });
    return this.selectedNodes;
  }

  getVotePercent(votes: string): string {
    const votePercent: number = parseFloat(votes) / this.nodesService.totalVotes * 100;
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


