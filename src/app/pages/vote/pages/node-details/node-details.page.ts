import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NodesService } from 'src/app/nodes.service';
import { Node } from 'src/app/nodes.model';

declare let appService: any;

@Component({
  selector: 'app-node-details',
  templateUrl: './node-details.page.html',
  styleUrls: ['./node-details.page.scss'],
})
export class NodeDetailsPage implements OnInit {

  node: Node;
  _nodes: Node[];
  totalVotes = 0;

  constructor(
    private nodesService: NodesService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('nodeId')) {
        this.navCtrl.navigateBack('/vote');
        return;
      }
      this.node = this.nodesService.getNode(paramMap.get('nodeId'));
      console.log('Node = ' + this.node.Nickname);
      this._nodes = this.nodesService.nodes;
      console.log('Nodes from Details ->', this._nodes);
      this.getTotalVotes();
    });
  }

  getTotalVotes() {
    this._nodes.map(node => {
      this.totalVotes += parseFloat(node.Votes);
    });
    console.log('Total Votes -> ' + this.totalVotes);
  }

  closeApp() {
    appService.close();
  }

  // helpers
  getVotes(votes) {
    return parseInt(votes);
  }

  getState(state) {
    if (state === 'Active') {
      return 'Active';
    } else {
      return 'Inactive';
    }
  }

  getVotePercentage(votes) {
    const votePercentage = parseFloat(votes) / this.totalVotes;
    return votePercentage.toFixed(4);
  }
}
