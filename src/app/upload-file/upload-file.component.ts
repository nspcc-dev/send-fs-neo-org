import { Component} from '@angular/core';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent  {

  files: any = [];

  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name);
      if (element["size"] / 1000000 > 50) {
        //todo: add validation and in this case don't allow to store
        console.log("WARNING FILE OVER 50 MB!")
      }
    }
  }
  deleteAttachment(index) {
    this.files.splice(index, 1)
  }
}
