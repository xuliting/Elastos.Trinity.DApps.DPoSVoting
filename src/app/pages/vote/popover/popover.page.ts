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
    const votePercent: number = parseFloat(votes) / this.totalVotes * 100;
    return votePercent.toFixed(2);
  }

  getEla(votes: string): string {
    const fixedVotes = parseInt(votes);
    let ElaVotes: number = Math.ceil(fixedVotes / 36);
    return ElaVotes.toLocaleString().split(/\s/).join(',');
  }
}


/* import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/nodes.service';
import { Node } from 'src/app/nodes.model';

declare let appManager: any;

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {

  sliderConfig = {
  }

  _nodes: Node[] = [];
  totalVotes: number = 0;
  nodesLoaded: boolean = true;

  constructor(
    private nodesService: NodesService,
  ) {}

  ngOnInit() {
    this._nodes = this.nodesService.nodes;
    this.getTotalVotes();
  }

  getTotalVotes() {
    this._nodes.map(node => {
      this.totalVotes += parseFloat(node.Votes);
    });
    console.log('Total Votes -> ' + this.totalVotes);
  }

  closeApp() {
    appManager.close();
  }

  // modify data
  getVotes(votes: string): string {
    const fixedVotes = parseInt(votes);
    return fixedVotes.toLocaleString().split(/\s/).join(',');
  }

  getVotePercent(votes: string): string {
    const votePercent: number = parseFloat(votes) / this.totalVotes * 100;
    return votePercent.toFixed(2);
  }

  getEla(votes: number): string {
    let ElaVotes: number = Math.ceil(votes / 36);
    return ElaVotes.toLocaleString().split(/\s/).join(',');
  }
}
 */
