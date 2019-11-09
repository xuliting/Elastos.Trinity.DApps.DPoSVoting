import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Node } from './nodes.model';

@Injectable({
  providedIn: 'root'
})
export class NodesService {

  private _nodes: Node[] = [
    /* {
      Producer_public_key: '1',
      Value: '',
      Address: '',
      Rank: 1,
      Ownerpublickey: '3wdsdwudh3dhsu378w8duh38',
      Nodepublickey: '',
      Nickname: 'King Tut\'s Hut',
      Url: 'https://www.pyramidofnodes.com',
      Location:  24,
      Active: true,
      Votes: '500',
      votePercentage: '2.5',
      Netaddress: '',
      State: '',
      Registerheight: 0,
      Cancelheight: 0,
      Inactiveheight: 0,
      Illegalheight: 0,
      Index: 1,
      Reward: '',
      EstRewardPerYear: '',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/08/24/05/21/pyramid-2675466_1280.jpg'
    }
    ,
    {
      Producer_public_key: '2',
      Value: '',
      Address: '',
      Rank: 2,
      Ownerpublickey: 'arwdwa353rfsedferfsefs5e4fe',
      Nodepublickey: '',
      Nickname: 'Ottoman\'s Delight',
      Url: 'https://www.turkishdelights.com',
      Location:  26,
      Active: true,
      Votes: '1000',
      votePercentage: '3.8',
      Netaddress: '',
      State: '',
      Registerheight: 0,
      Cancelheight: 0,
      Inactiveheight: 0,
      Illegalheight: 0,
      Index: 1,
      Reward: '',
      EstRewardPerYear: '',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/05/30/15/02/orient-2357224_1280.jpg',
    },
    {
      Producer_public_key: '3',
      Value: '',
      Address: '',
      Rank: 3,
      Ownerpublickey: 'aarwdwa3rwrferfsefs5e4fe',
      Nodepublickey: '',
      Nickname: 'Holy Trinity',
      Url: 'https://www.holytrinity.com',
      Location:  33,
      Active: true,
      Votes: '1500',
      votePercentage: '1.8',
      Netaddress: '',
      State: '',
      Registerheight: 0,
      Cancelheight: 0,
      Inactiveheight: 0,
      Illegalheight: 0,
      Index: 1,
      Reward: '',
      EstRewardPerYear: '',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/08/08/11/51/jerusalem-church-2611203_1280.jpg'
    } */
  ];

  currentHeight: any;

  constructor(private http: HttpClient) {
    this.fetchCurrentHeight();
  }

  fetchCurrentHeight() {
    this.http.get<any>('https://node1.elaphant.app/api/1/currHeight').subscribe(responce => {
      this.currentHeight = responce;
      console.log('Current height = ' + responce.result);
    });
  }

  fetchNodes(): Observable<Node[]> {
    console.log('Fetching Nodes..');
    this._nodes = [];
    return this.http.get<Node[]>('https://node1.elaphant.app/api/v1/dpos/rank/height/' + this.currentHeight.result).pipe(
      tap(response => {
        this._nodes = this._nodes.concat(response.result);
        // this._nodes = response.result;
        console.log("Nodes from service ->", this._nodes);
        return this._nodes;
      })
    );
  }

  get nodes() {
    return [...this._nodes];
  }

  getNode(id: string) {
    return {...this._nodes.find(node => node.Producer_public_key === id)};
  }
}
