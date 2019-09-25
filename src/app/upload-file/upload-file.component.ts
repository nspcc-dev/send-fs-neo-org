import {Component} from '@angular/core';
import {UploaderService} from "../services/uploader.service";
import {FileStoreService} from "../services/filestore.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {

  files: File[] = [];

  constructor(
    private uploaderService: UploaderService,
    private fileStoreService: FileStoreService,
    private router: Router) {
  }

  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element);
      if (element["size"] / 1000000 > 50) {
        //todo: add validation and in this case don't allow to store
        console.log("WARNING FILE OVER 50 MB!")
      }
    }
    this.fileStoreService.updateStoredFiles(this.files);
  }
  deleteAttachment(index) {
    this.files.splice(index, 1);
    this.fileStoreService.updateStoredFiles(this.files);
  }

  downloadFile(upload: any) {
    this.router.navigateByUrl(`/load/${upload.oid}`);
  }
}
