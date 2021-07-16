import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FileStoreService } from "../services/filestore.service";
import { UploaderService } from "../services/uploader.service";

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
      { value: '2', viewValue: '12 hours (2 epochs)' },
      { value: '4', viewValue: '1 day (4 epochs)' },
      { value: '8', viewValue: '2 days (8 epochs)' },
      { value: '16', viewValue: '4 days (16 epochs)' },
    ];
    this.selectedLifetime = this.lifetimes[0];

    //this.fileStoreService.setCid()
  }

  constructor(public fileStoreService: FileStoreService, public uploaderService: UploaderService) {
  }

  onUpload() {
    this.uploaderService.setLoading(true);
    this.fileStoreService.putFile(this.selectedLifetime.value)
  }
}
