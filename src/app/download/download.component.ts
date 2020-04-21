import {Component, OnDestroy, OnInit} from '@angular/core';
import {FileStoreService} from "../services/filestore.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {environment} from "../../environments/environment";

@Component({
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})

export class DownloadComponent implements OnInit, OnDestroy {
  public loading = true;
  private routeSub: Subscription;
  private fileID: string;
  private file: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fileStoreService: FileStoreService) {
  }

  ngOnInit(): void {
    this.fileStoreService.setCid()
    
    this.routeSub = this.route.params.subscribe(params => {
      this.fileID = params['id'];
      this.fileStoreService.checkFile(this.fileID).subscribe(
        result => {
          if (result === "OK") {
            this.loading = false;
          } else {
            //this.router.navigateByUrl("/not-found-404", {state: {data: {message: '404: Requested object not found.', details: 'Most probably the storage period has expired and the object has been deleted.'}}});
          }
        },
        errorResponse => {
          //this.router.navigateByUrl("/not-found", {state: {data: errorResponse["error"]["message"]}});
        }
      )
    })
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  download() {
    this.fileStoreService.getFile(this.fileID).subscribe(resp => {
      this.file = resp;
      let downloadLink = document.createElement('a');
      downloadLink.href = environment.downloadLinkUrl+"/"+this.getFileCid()+"/"+this.getFileId()+"?download=1";
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
  }

  getCDN(){
    return `${environment.downloadLinkUrl}`;
  }

  getFileUrl() {
    return `${environment.downloadLinkUrl}/api/get/${this.fileID}/`;
  }

  getFileId() {
    return `${this.fileID}`;
  }

  getFileCid() {
    return this.fileStoreService.getCid()
  }

  getFileOid() {
    return this.file.oid;
  }

  getFileCopyLink(){
    return `${environment.downloadLinkUrl}/${this.getFileCid()}/${this.getFileId()}`
  }

  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }
}
