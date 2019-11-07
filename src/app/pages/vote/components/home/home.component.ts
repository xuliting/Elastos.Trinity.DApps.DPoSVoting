import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  elaCount = 500;
  nodeCount = 36;

  constructor() { }

  ngOnInit() {}

}
