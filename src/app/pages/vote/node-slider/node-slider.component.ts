import { Component, OnInit, Input } from '@angular/core';
import { Node } from 'src/app/nodes.model';

@Component({
  selector: 'app-node-slider',
  templateUrl: './node-slider.component.html',
  styleUrls: ['./node-slider.component.scss'],
})
export class NodeSliderComponent implements OnInit {

  @Input() _nodes: Node[] = [];
  @Input() totalVotes: number = 0;
  @Input() nodeIndex: number;

  slideOpts = {
    initialSlide: null,
    speed: 400,
    centeredSlides: true,
    slidesPerView: 1.2
  };

  constructor() {
  }

  ngOnInit() {
    this.slideOpts.initialSlide = this.nodeIndex;
    console.log('Node Index -> ' + this.nodeIndex);
  }

  // Modify Values
  getVotes(votes: string): string {
    const fixedVotes = parseInt(votes);
    return fixedVotes.toLocaleString().split(/\s/).join(',');
  }

  getVotePercent(votes: string): string {
    const votePercent: number = parseFloat(votes) / this.totalVotes * 100;
    return votePercent.toFixed(2);
  }

  getEla(votes: number): string {
    let ElaVotes: number = Math.ceil(votes / 36);
    return ElaVotes.toLocaleString().split(/\s/).join(',');
  }
}
