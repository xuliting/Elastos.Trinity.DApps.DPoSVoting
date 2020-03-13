import { Component, OnInit } from '@angular/core';
import { NodesService } from 'src/app/services/nodes.service';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {

  constructor(public nodesService: NodesService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
  }

  updateStats(event) {
    setTimeout(() => {
      this.nodesService.fetchStats().then(() => {
        event.target.complete();
      });
    }, 2000);
  }

  //// Define Values ////
  fixHeight(): string {
    return this.nodesService.currentHeight.toLocaleString().split(/\s/).join(',');
  }

  fixTotalVotes(): string {
    return this.nodesService.totalVotes.toLocaleString().split(/\s/).join(',');
  }

  fixTotalEla(): string {
    let ela: number = parseFloat(this.nodesService.voters.ELA);
    return ela.toLocaleString().split(/\s/).join(',');
  }

  fixTotalVoters(): string {
    return this.nodesService.voters.total.toLocaleString().split(/\s/).join(',');
  }

  fixActiveAddresses(): string {
    return this.nodesService.mainchain.activeaddresses.toLocaleString().split(/\s/).join(',');
  }

  fixSupply(): string {
    let supply: number = parseFloat(this.nodesService.price.circ_supply);
    return supply.toLocaleString().split(/\s/).join(',');
  }

  fixVolume(): string {
    let volume: number = parseFloat(this.nodesService.price.volume);
    return volume.toLocaleString().split(/\s/).join(',');
  }

  /*   getVotePercent(): string {
    let votePercent: number = this.nodesService.totalVotes / (parseFloat(this.nodesService.price.circ_supply) * 36) * 100;
    return votePercent.toFixed(2);
  } */

  /* getTotalRewards(): string {
    let totalRewards = 0;
    this.nodesService._nodes.map(node => {
      totalRewards += parseInt(node.EstRewardPerYear);
    });
    totalRewards = totalRewards / 365
    return totalRewards.toLocaleString().split(/\s/).join(',');
  } */

}
