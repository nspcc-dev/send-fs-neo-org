import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {UploadComponent} from './upload/upload.component';
// import { UsersComponent } from './users/users.component';
// import { UserComponent } from './users/user/user.component';
// import { ServersComponent } from './servers/servers.component';
// import { ServerComponent } from './servers/server/server.component';
// import { EditServerComponent } from './servers/edit-server/edit-server.component';
// import { AuthGuard } from './auth-guard.service';
// import { CanDeactivateGuard } from './servers/edit-server/can-deactivate-guard.service';
import {ErrorPageComponent} from './error-page/error-page.component';
import {DownloadComponent} from "./download/download.component";
// import { ServerResolverService } from './servers/server/server-resolver.service';

const appRoutes: Routes = [
  {path: '', component: UploadComponent},
  {path: 'load/:id', component: DownloadComponent},
  // {
  //   path: 'users', component: UsersComponent, children: [
  //     { path: ':id/:name', component: UserComponent },
  //   ],
  // },
  // {
  //   path: 'servers',
  //   // canActivate: [AuthGuard],
  //   canActivateChild: [AuthGuard],
  //   component: ServersComponent,
  //   children: [
  //     { path: ':id', component: ServerComponent, resolve: { server: ServerResolverService } },
  //     { path: ':id/edit', component: EditServerComponent, canDeactivate: [CanDeactivateGuard] },
  //   ],
  // },
  {path: 'not-found', component: ErrorPageComponent, data: {message: 'Sorry, some error happened or your page not found.'}},
  {path: 'error', redirectTo: '/not-found'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),

    // RouterModule.forRoot(appRoutes, { useHash: true }),

    // this is using by fallback of the 404 error state of the index
    // redirection for the not configured servers or old browser
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {

}
