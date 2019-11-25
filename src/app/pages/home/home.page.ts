import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/nodes.service';
import { Node } from 'src/app/nodes.model';

declare let appManager: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  _nodes: Node[] = [];
  totalVotes: number = 0;
  activeNodes: number = 0;
  nodesLoaded: boolean = false;

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

  // appManager
  closeApp() {
    appManager.close();
  }

  // modify data
  getTotalEla(): string {
    let ElaVotes: number = Math.ceil(this.totalVotes / 36);
    return ElaVotes.toLocaleString().split(/\s/).join(',');
  }
}
