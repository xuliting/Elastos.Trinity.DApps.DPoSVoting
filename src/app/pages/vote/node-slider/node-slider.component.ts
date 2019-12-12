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
  @Input() node: Node;

  displayedArr: Node[] = [];

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    centeredSlides: true,
    slidesPerView: 1.2
  };

  constructor() {
  }

  ngOnInit() {
    if (this.nodeIndex < 10) {
      this.displayedArr = this._nodes.slice(0, 12);
      this.slideOpts.initialSlide = this.displayedArr.indexOf(this.node);
    }
    if (this.nodeIndex >= 10) {
      this.displayedArr = this._nodes.slice(this.nodeIndex - 10, this.nodeIndex + 2);
      this.slideOpts.initialSlide = this.displayedArr.indexOf(this.node);
    }
    console.log('Node' + this.nodeIndex + this.node);
  }

  loadNext() {
    let lastNode = this.displayedArr.slice(-1)[0];
    let nextNodeIndex = this._nodes.indexOf(lastNode) + 1;
    this.displayedArr = this.displayedArr.concat(this._nodes[nextNodeIndex]);
    console.log('last node', lastNode);
    console.log('next node', this._nodes[nextNodeIndex]);
  }

  /* loadPrev() {
    let firstNode = this.displayedArr[0];
    let prevNodeIndex = this._nodes.indexOf(firstNode) - 1;
    this.displayedArr.unshift(this._nodes[prevNodeIndex]);
    console.log('first node', firstNode);
  } */

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
