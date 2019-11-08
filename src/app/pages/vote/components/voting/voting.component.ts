import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/nodes.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss'],
})
export class VotingComponent implements OnInit {

  nodes = [];
  selectedNodes = 0;

  constructor(private nodesService: NodesService) { }

  ngOnInit() {
    this.nodes = this.nodesService.nodes;
    console.log(this.nodes);
  }

  addNode() {
    console.log('node added');
  }

}
