import {Component, OnDestroy, OnInit} from '@angular/core';
import {UploaderService} from "../services/uploader.service";
import {FileStoreService} from "../services/filestore.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit, OnDestroy {

  files: File[] = [];

  constructor(
    public uploaderService: UploaderService,
    public fileStoreService: FileStoreService,
    private router: Router,
    private notification: MatSnackBar) {
  }

  uploadFile(event) {
    this.files=this.fileStoreService.getFiles();
    
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
    return `/load/${id}`;
  }

  getFileCopyLink(id: string){
    return `${environment.downloadLinkUrl}/${this.fileStoreService.getCid()}/${id}`;
  }

  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  ngOnDestroy(): void {
    //this.fileStoreService.updateStoredFiles([]);
    //this.uploaderService.setLoading(false);
    //this.uploaderService.setLoaded(false);
  }

  ngOnInit(): void {
    this.fileStoreService.setCid()
    console.log(this.fileStoreService.getUploadResult());
    this.files=this.fileStoreService.getFiles();
    //this.fileStoreService.updateStoredFiles([]);
    //this.uploaderService.setLoading(false);
    //this.uploaderService.setLoaded(false);
  }
}
