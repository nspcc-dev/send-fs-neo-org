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
      {value: '15', viewValue: '15 minutes'},
      {value: '60', viewValue: '1 hour'},
      {value: '180', viewValue: '3 hours'},
      {value: '360', viewValue: '6 hours'},
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
