import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VotePage } from './vote.page';
import { NodeSliderComponent } from './node-slider/node-slider.component';

const routes: Routes = [
  {
    path: '',
    component: VotePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [VotePage, NodeSliderComponent]
})
export class VotePageModule {}
