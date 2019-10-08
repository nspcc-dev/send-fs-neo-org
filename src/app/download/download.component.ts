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
    this.routeSub = this.route.params.subscribe(params => {
      this.fileID = params['id'];
      this.fileStoreService.checkFile(this.fileID).subscribe(
        result => {
          if (result === "OK") {
            this.loading = false;
          } else {
            //this.router.navigateByUrl("/not-found", {state: {data: `File with id = [${this.fileID}] wasn't found.`}});
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
      downloadLink.href = window.URL.createObjectURL(this.file);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
  }

  getFileUrl() {
    return `${environment.baseUrl}/api/get/${this.fileID}`;
  }

  getFileCid() {
    return this.file.CID;
  }

  getFileOid() {
    return this.file.OID;
  }
}
