import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {UploadComponent} from './upload/upload.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {ErrorPageComponent404} from './error-page-404/error-page-404.component';
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
  {
    path: 'not-found-404',
    component: ErrorPageComponent404,
    data: {message: '404: Requested object not found.',
           details: 'Most probably the storage period has expired and the object has been deleted.'}
  },
  {path: 'error', redirectTo: '/not-found'},
  {path: '404', component: ErrorPageComponent404,
      data: {message: '404: Requested object not found.',
      details: 'Most probably the storage period has expired and the object has been deleted.'}},
  {path: '**', redirectTo: '/not-found-404'}

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
