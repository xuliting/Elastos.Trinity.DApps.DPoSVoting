import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/nodes.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Node } from 'src/app/nodes.model';

@Component({
  selector: 'app-node-details',
  templateUrl: './node-details.page.html',
  styleUrls: ['./node-details.page.scss'],
})
export class NodeDetailsPage implements OnInit {

  node: Node;
  _nodes: Node[] = [];
  totalVotes: number = 0;

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

  // routing
  goBack() {
    this.navCtrl.navigateBack(['/', 'vote']);
  }

  // modify data
  getVotes(votes: string): string {
    const fixedVotes = parseInt(votes);
    return fixedVotes.toLocaleString().split(/\s/).join(',');
  }

  getState(state: string): string {
    if (state === 'Active') {
      return state;
    } else {
      return 'Inactive';
    }
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
