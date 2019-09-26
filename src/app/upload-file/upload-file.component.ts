import {Component} from '@angular/core';
import {UploaderService} from "../services/uploader.service";
import {FileStoreService} from "../services/filestore.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {

  files: File[] = [];

  constructor(
    public uploaderService: UploaderService,
    public fileStoreService: FileStoreService,
    private router: Router,
    private notification: MatSnackBar) {
  }

  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      if ((element["size"] / 1000000) > 50) {
        console.log("WARNING FILE OVER 50 MB!");
        this.notification.open("Selected file is over 50Mb. We don't support such big files.", "OK", {duration: 5000})
      } else {
        this.files.push(element);
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

  getFileUrl(id: string) {
    return `${window.location.origin}/load/${id}`;
  }
}
