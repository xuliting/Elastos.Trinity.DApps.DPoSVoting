import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { VotePageModule } from './pages/vote/vote.module';
import { AboutPageModule } from './pages/about/about.module';
import { SettingsPageModule } from './pages/settings/settings.module';
import { NodeDetailsPageModule } from './pages/vote/pages/node-details/node-details.module';

const routes: Routes = [
  { path: '', redirectTo: 'vote', pathMatch: 'full' },
  { path: 'vote', loadChildren: () => VotePageModule },
  { path: 'about', loadChildren: () => AboutPageModule },
  { path: 'settings', loadChildren: () => SettingsPageModule },
  { path: ':nodeId', loadChildren: () => NodeDetailsPageModule }
];

@NgModule({
  imports: [
    VotePageModule,
    AboutPageModule,
    SettingsPageModule,
    NodeDetailsPageModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
