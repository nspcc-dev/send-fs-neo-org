import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FileStoreService} from "../services/filestore.service";
import {UploaderService} from "../services/uploader.service";

export interface Lifetime {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'select-and-push',
  templateUrl: './selector-and-push.component.html',
  styleUrls: ['./selector-and-push.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectorAndPushComponent implements OnInit {

  public selectedLifetime: Lifetime;
  public lifetimes: Lifetime[];

  ngOnInit(): void {
    this.lifetimes = [
      {value: '360', viewValue: '6 hours'},
      {value: '720', viewValue: '12 hours'},
      {value: '1440', viewValue: '24 hours'},
    ];
    this.selectedLifetime = this.lifetimes[0];

    this.fileStoreService.setCid()
  }

  constructor(public fileStoreService: FileStoreService, public uploaderService: UploaderService) {
  }

  onUpload() {
    this.uploaderService.setLoading(true);
    this.fileStoreService.putFile(this.selectedLifetime.value)
  }
}
