import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePageModule } from './pages/home/home.module';
import { StatsPageModule } from './pages/stats/stats.module';
import { VotePageModule } from './pages/vote/vote.module';
import { NodeDetailsPageModule } from './pages/vote/node-details/node-details.module';
import { PopoverPageModule } from './pages/vote/popover/popover.module';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => HomePageModule },
  { path: 'stats', loadChildren: () => StatsPageModule },
  { path: 'vote', children: [
      { path: '', loadChildren: () =>  VotePageModule },
      { path: ':nodeId', loadChildren: () => NodeDetailsPageModule },
      { path: ':_nodeId', loadChildren: () => PopoverPageModule }
  ]},
];

@NgModule({
  imports: [
    HomePageModule,
    StatsPageModule,
    VotePageModule,
    NodeDetailsPageModule,
    PopoverPageModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
