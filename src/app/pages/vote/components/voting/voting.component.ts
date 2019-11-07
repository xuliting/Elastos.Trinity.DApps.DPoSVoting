import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss'],
})
export class VotingComponent implements OnInit {

  nodes = [
    {
      id: 1,
      name: 'Node One',
      location: 'Cairo',
      votes: '500',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/08/24/05/21/pyramid-2675466_1280.jpg'
    },
    {
      id: 2,
      name: 'Node Two',
      location: 'Istanbul',
      votes: '1000',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/05/30/15/02/orient-2357224_1280.jpg'
    },
    {
      id: 3,
      name: 'Node Three',
      location: 'Jerusalem',
      votes: '1500',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/08/08/11/51/jerusalem-church-2611203_1280.jpg'
    }
  ];

  constructor() { }

  ngOnInit() {}

}
