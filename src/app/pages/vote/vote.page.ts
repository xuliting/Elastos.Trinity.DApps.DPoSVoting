import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/nodes.service';
import { NavController, PopoverController } from '@ionic/angular';
import { Node } from 'src/app/nodes.model';
import { PopoverPage } from './popover/popover.page';

declare let appManager: any;

@Component({
  selector: 'app-vote',
  templateUrl: './vote.page.html',
  styleUrls: ['./vote.page.scss'],
})
export class VotePage implements OnInit {

  _nodes: Node[] = [];
  filteredNodes: Node[] = [];
  totalVotes: number = 0;
  nodesLoaded: boolean = true;
  castingVote: boolean = false;

  constructor(
    private nodesService: NodesService,
    private navCtrl: NavController,
    private popover: PopoverController
  ) {}

  ngOnInit() {
    this._nodes = this.nodesService.nodes;
    this.filteredNodes = this._nodes;
    this.getTotalVotes();
    if (this._nodes.length === 0) {
      this.nodesLoaded = false;
      this.nodesService.fetchNodes().subscribe(nodes => {
        this.nodesLoaded = true;
        this._nodes = nodes.result;
        this.filteredNodes = this._nodes;
        console.log('Nodes from Voting ->', this._nodes);
        this.getTotalVotes();
        this.nodesService.getNodeIcon();
      });
    }
  }

  getTotalVotes() {
    this._nodes.map(node => {
      this.totalVotes += parseFloat(node.Votes);
    });
    console.log('Total Votes -> ' + this.totalVotes);
  }

  filterNodes(search): any {
    this.filteredNodes = this._nodes.filter((node) => {
      return node.Nickname.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
    console.log(this.filteredNodes);
  }

  // routing
  goToNode(id) {
    this.navCtrl.navigateForward(['/', 'vote', id]);
  }

  async presentPopover(id) {
    const _popover = await this.popover.create({
      component: PopoverPage,
      componentProps: {
        _nodeId: id
      },
      translucent: true
    });
    return await _popover.present();
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
        this.castingVote = false;
      }, (err) => {
        console.log('Intent sending failed', err);
      }
    );
  }

  closeApp() {
    appManager.close();
  }

  // modify data
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
}
