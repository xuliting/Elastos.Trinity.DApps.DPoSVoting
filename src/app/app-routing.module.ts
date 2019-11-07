import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { VotePageModule } from './pages/vote/vote.module';
import { AboutPageModule } from './pages/about/about.module';
import { SettingsPageModule } from './pages/settings/settings.module';

const routes: Routes = [
  { path: '', redirectTo: 'vote', pathMatch: 'full' },
  { path: 'vote', loadChildren: () => VotePageModule },
  { path: 'about', loadChildren: () => AboutPageModule },
  { path: 'settings', loadChildren: () => SettingsPageModule },
  { path: 'node-details', loadChildren: './pages/vote/pages/node-details/node-details.module#NodeDetailsPageModule' },
];

@NgModule({
  imports: [
    VotePageModule,
    AboutPageModule,
    SettingsPageModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
