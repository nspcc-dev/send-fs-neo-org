import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {MaterialAppModule} from "./ngmaterial.module";

import {FooterComponent} from "./footer/footer.component";
import {UploadFileComponent} from "./upload-file/upload-file.component";
import {DragDropDirective} from "./drag-drop.directive";
import {SelectorAndPushComponent} from "./selector-and-push/selector-and-push.component";
import {FileStoreService} from "./services/filestore.service";
import {UploadComponent} from "./upload/upload.component";
import {ErrorPageComponent} from "./error-page/error-page.component";
import {ErrorPageComponent404} from "./error-page-404/error-page-404.component";
import {DownloadComponent} from "./download/download.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ReactiveFormsModule} from "@angular/forms";
import {UploaderService} from "./services/uploader.service";
import {TosComponent} from "./tos/tos.component";

import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    UploadFileComponent,
    DragDropDirective,
    UploadComponent,
    ErrorPageComponent,
    ErrorPageComponent404,
    SelectorAndPushComponent,
    DownloadComponent,
    TosComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    MaterialAppModule,
    AppRoutingModule,
    HttpClientModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  providers: [FileStoreService, UploaderService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
