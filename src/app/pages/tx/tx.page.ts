import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';

import { Vote } from 'src/app/models/history.model';
import { NodesService } from 'src/app/services/nodes.service';
import { Node } from 'src/app/models/nodes.model';

@Component({
  selector: 'app-tx',
  templateUrl: './tx.page.html',
  styleUrls: ['./tx.page.scss'],
})
export class TxPage implements OnInit {

  // Initial values
  public vote: Vote;
  public _nodes: Node[] = [];

  // Node Detail
  public showNode: boolean = false;
  public nodeIndex: number;
  public node: Node;

  constructor(
    public nodesService: NodesService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('txId')) {
        this.navCtrl.navigateBack('/menu/history');
        return;
      }
      this.vote = this.nodesService.getVote(paramMap.get('txId'));
      this.getNodes();
      console.log(this.vote);
    });
  }

  getNodes() {
    this.nodesService._nodes.map(node => {
      if (this.vote.keys.includes(node.Ownerpublickey)) {
        this._nodes = this._nodes.concat(node)
      }
    });
  }

  modDate(date) {
    return moment(date).format("MMM Do YY, h:mm:ss a");
  }

  //// Define Values ////
  getVotes(votes: string): string {
    const fixedVotes: number = parseInt(votes);
    return fixedVotes.toLocaleString().split(/\s/).join(',');
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
}
