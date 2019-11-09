import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/nodes.service';
import { Node } from 'src/app/nodes.model';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss'],
})
export class VotingComponent implements OnInit {

  _nodes: Node[];
  nodesLoaded = false;
  voteList: Node[];

  constructor(private nodesService: NodesService) {
    this.nodesLoaded = false;
    this.nodesService.fetchNodes().subscribe((nodes: Node[]) => {
      this.nodesLoaded = true;
      this._nodes = nodes.result;
      console.log('Nodes from component ->', this._nodes);
    });
  }

  ngOnInit() {}

  addNode(e) {
    // console.log('node added ->' + node.Nickname);
    if (e.target.checked) {
      this.myDelegates.push(e.target.value);
      console.log(this.myDelegates);
    }
  }

  removeNode(node) {
    console.log('node removed ->' + node.nickName);
  }

  // helpers
  getVotes(votes) {
    return parseInt(votes);
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
}

