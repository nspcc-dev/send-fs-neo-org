import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';


import {AppComponent} from './app.component';
import {MaterialAppModule} from "./ngmaterial.module";

import {FooterComponent} from "./footer/footer.component";
import {UploadFileComponent} from "./upload-file/upload-file.component";
import {DragDropDirective} from "./drag-drop.directive";
import {HeaderComponent} from "./header/header.component";
import {SelectorAndPushComponent} from "./selector-and-push/selector-and-push.component";
import {FileStoreService} from "./services/filestore.service";


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    UploadFileComponent,
    DragDropDirective,
    HeaderComponent,
    SelectorAndPushComponent
  ],
  imports: [
    BrowserModule,
    MaterialAppModule,
    HttpClientModule
  ],
  providers: [FileStoreService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
