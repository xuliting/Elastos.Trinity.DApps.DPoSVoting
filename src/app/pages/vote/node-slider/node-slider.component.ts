import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Node } from 'src/app/models/nodes.model';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-node-slider',
  templateUrl: './node-slider.component.html',
  styleUrls: ['./node-slider.component.scss'],
})
export class NodeSliderComponent implements OnInit {

  @ViewChild('slider', {static: false}) slider: IonSlides;

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
    this.displayedArr = this._nodes.slice(0, this.nodeIndex + 2);
    this.slideOpts.initialSlide = this.displayedArr.indexOf(this.node);
  }

  //// Increment nodes array when sliding forward ////
  loadNext() {
    let lastNode = this.displayedArr.slice(-1)[0];
    let nextNodeIndex = this._nodes.indexOf(lastNode) + 1;
    if(nextNodeIndex) {
      this.displayedArr.push(this._nodes[nextNodeIndex]);
    }
    console.log('last node', lastNode);
    console.log('next node', this._nodes[nextNodeIndex]);
  }

  //// Define Values ////
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

  getRewards(yearlyRewards: string): string {
    const dailyRewards: number =  parseFloat(yearlyRewards) / 365;
    return dailyRewards.toFixed(2);
  }
}

  /*
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
  */

  /*
  loadPrev(slider) {
    let firstNode = this.displayedArr[0];
    console.log(this.displayedArr[0]);
    let prevNodeIndex = this._nodes.indexOf(firstNode) - 1;
    this.displayedArr = [].concat(this._nodes[prevNodeIndex], ...this.displayedArr);
    // this.displayedArr.unshift(this._nodes[prevNodeIndex]);
    console.log(this._nodes[prevNodeIndex]);
    console.log(this.displayedArr);
  }
  */
