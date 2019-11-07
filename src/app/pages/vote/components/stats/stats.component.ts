import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {

  totalVotes = 123456789;
  voteRatio = 25.34;
  registeredNodes = 96;

  constructor() { }

  ngOnInit() {}

}
