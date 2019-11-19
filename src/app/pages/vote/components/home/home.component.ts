import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NodesService } from 'src/app/nodes.service';
import { Node } from 'src/app/nodes.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  @Output() votingActive = new EventEmitter<boolean>();

  _nodes: Node[];
  totalVotes = 0;
  activeNodes = 0;
  nodesLoaded = false;

  slideOpts = {
    initialSlide: 0,
    speed: 300
  };

  constructor(private nodesService: NodesService) {
  }

  ngOnInit() {
    this.nodesLoaded = true;
    this._nodes = this.nodesService.nodes;
    this.getTotalVotes();
    if (this._nodes.length === 0) {
      this.nodesLoaded = false;
      this.nodesService.fetchCurrentHeight()
        .then(() => {
          this.nodesService.fetchNodes().subscribe(nodes => {
            this.nodesLoaded = true;
            this._nodes = nodes.result;
            console.log('Nodes from Home ->', this._nodes);
            this.getTotalVotes();
            this.nodesService.getNodeIcon();
          });
        })
        .catch(err => console.log('Cannot retrieve data', err));
    }
  }

  getTotalVotes() {
    this._nodes.map(node => {
      this.totalVotes += parseInt(node.Votes);
      if(node.State === 'Active') {
        this.activeNodes++;
      }
    });
  }

  showVote() {
    this.votingActive.emit(true);
  }

  // helpers
  getTotalEla() {
    let ElaVotes = Math.ceil(this.totalVotes / 36);
    return ElaVotes.toLocaleString().split(/\s/).join(',');
  }
}
