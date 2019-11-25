import { Component, OnInit } from '@angular/core';
import { Node } from 'src/app/nodes.model';
import { NodesService } from 'src/app/nodes.service';
import { NavParams, NavController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {

  node: Node;
  _nodes: Node[] = [];
  totalVotes: number = 0;

  constructor(
    private nodesService: NodesService,
    private navParams: NavParams,
    private navCtrl: NavController,
    private popover: PopoverController
  ) { }

  ngOnInit() {
    this.node = this.nodesService.getNode(this.navParams.get('_nodeId'));
  }

  getTotalVotes() {
    this._nodes.map(node => {
      this.totalVotes += parseFloat(node.Votes);
    });
  }

  // routing
  goToNode(id) {
    this.navCtrl.navigateForward(['/', 'vote', id]);
    this.popover.dismiss();
  }

  goBack() {
    this.popover.dismiss();
  }

  // modify data
  getVotes(votes: string): string {
    const fixedVotes = parseInt(votes);
    return fixedVotes.toLocaleString().split(/\s/).join(',');
  }

  getVotePercent(votes: string): string {
    const votePercent = parseFloat(votes) / this.totalVotes * 100;
    return votePercent.toFixed(2);
  }

  getEla(votes: number): string {
    let ElaVotes: number = Math.ceil(votes / 36);
    return ElaVotes.toLocaleString().split(/\s/).join(',');
  }
}
