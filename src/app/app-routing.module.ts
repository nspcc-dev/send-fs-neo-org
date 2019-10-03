import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {UploadComponent} from './upload/upload.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {DownloadComponent} from "./download/download.component";
import {TosComponent} from "./tos/tos.component";

const appRoutes: Routes = [
  {path: '', component: UploadComponent},
  {path: 'load/:id', component: DownloadComponent},
  {path: 'tos', component: TosComponent},
  {
    path: 'not-found',
    component: ErrorPageComponent,
    data: {message: 'Sorry, some error happened or your page not found.'}
  },
  {path: 'error', redirectTo: '/not-found'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {

}
