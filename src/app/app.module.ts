import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {MaterialAppModule} from "./ngmaterial.module";

import {FooterComponent} from "./footer/footer.component";
import {UploadFileComponent} from "./upload-file/upload-file.component";
import {DragDropDirective} from "./drag-drop.directive";
import {HeaderComponent} from "./header/header.component";
import {SelectorAndPushComponent} from "./selector-and-push/selector-and-push.component";
import {FileStoreService} from "./services/filestore.service";
import {UploadComponent} from "./upload/upload.component";
import {ErrorPageComponent} from "./error-page/error-page.component";
import {DownloadComponent} from "./download/download.component";



@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    UploadFileComponent,
    DragDropDirective,
    HeaderComponent,
    UploadComponent,
    ErrorPageComponent,
    SelectorAndPushComponent,
    DownloadComponent,
  ],
  imports: [
    BrowserModule,
    MaterialAppModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [FileStoreService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
