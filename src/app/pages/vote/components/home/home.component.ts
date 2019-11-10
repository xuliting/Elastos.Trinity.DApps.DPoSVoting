import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NodesService } from 'src/app/nodes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  @Output() votingActive = new EventEmitter<boolean>();

  elaCount = 500;
  nodeCount = 36;

  constructor(private nodesService: NodesService) {
    this.nodesService.fetchCurrentHeight();
  }

  ngOnInit() {}

  showVote() {
    this.votingActive.emit(true);
  }

}
