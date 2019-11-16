import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NodesService } from 'src/app/nodes.service';
import { Node } from 'src/app/nodes.model';

declare let appService: any;

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss'],
})
export class VotingComponent implements OnInit {

  _nodes: Node[];
  filteredNodes: Node[];
  selectedNodes: Node[];
  nodesLoaded = true;
  totalVotes = 0;
  searchOn = false;

  constructor(
    private nodesService: NodesService,
    private router: Router
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

  filterNodes(search) {
    this.filteredNodes = this._nodes.filter((node) => {
      return node.Nickname.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
    console.log(this.filteredNodes);
  }

  toggleSearch() {
    this.searchOn = !this.searchOn;
  }

  navToNode(id) {
    this.router.navigateByUrl('/' + id);
  }

  castVote() {
    console.log('Casting votes..');
    this._nodes.map(node => {
      if (node.isChecked === true) {
        appService.sendIntent(
          'dposvotetransaction',
          { publickeys: JSON.stringify([node.Ownerpublickey]) },
          () => {
            console.log('Insent sent sucessfully');
          }, (err) => {
            console.log('Intent sendoing failed', err);
          }
        );
      }
    });
  }

  // helpers
  getVotes(votes) {
    const fixedVotes = parseInt(votes);
    return fixedVotes.toLocaleString().split(/\s/).join(',');
  }

  getSelectedNodes() {
    let addedNodes = 0;
    this._nodes.map(node => {
      if (node.isChecked === true) {
        addedNodes++;
      }
    });
    return addedNodes;
  }

  getVotePercent(votes) {
    const votePercent = parseFloat(votes) / this.totalVotes * 100;
    return votePercent.toFixed(2);
  }
}

