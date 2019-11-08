import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NodesService {

  _nodes = [
    {
      id: '1',
      name: 'King Tut\'s Hut',
      location: 'Cairo',
      totalVotes: '500',
      votePercentage: '2.5',
      website: 'https://www.pyramidofnodes.com',
      publickey: '3wdsdwudh3dhsu378w8duh38',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/08/24/05/21/pyramid-2675466_1280.jpg'
    }
    ,
    {
      id: '2',
      name: 'Ottoman\'s Delight',
      location: 'Istanbul',
      totalVotes: '1000',
      votePercentage: '3.8',
      website: 'https://www.turkishdelights.com',
      publickey: 'arwdwa353rfsedferfsefs5e4fe',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/05/30/15/02/orient-2357224_1280.jpg',
    },
    {
      id: '3',
      name: 'Holy Trinity',
      location: 'Jerusalem',
      totalVotes: '1500',
      votePercentage: '1.8',
      website: 'https://www.holytrinity.com',
      publickey: 'arwdwa3rwrferfsefs5e4fe',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/08/08/11/51/jerusalem-church-2611203_1280.jpg'
    }
  ];

  get nodes() {
    return [...this._nodes];
  }

  getNode(id: string) {
    return {...this._nodes.find(node => node.id === id)};
  }

  constructor() {}
}
