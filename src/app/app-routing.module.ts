import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePageModule } from './pages/home/home.module';
import { StatsPageModule } from './pages/stats/stats.module';
import { SearchPageModule } from './pages/search/search.module';
import { VotePageModule } from './pages/vote/vote.module';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => HomePageModule },
  { path: 'stats', loadChildren: () => StatsPageModule },
  { path: 'search', loadChildren: () => SearchPageModule },
  { path: 'vote', children: [
      { path: '', loadChildren: () =>  VotePageModule },
  ]},
];

@NgModule({
  imports: [
    HomePageModule,
    StatsPageModule,
    SearchPageModule,
    VotePageModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
