import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {UploaderService} from "./uploader.service";
import get = Reflect.get;
import {ResponseContentType} from "@angular/http";

@Injectable()
export class FileStoreService {

  baseUrl = environment.baseUrl;
  //storing files to be uploaded.
  files: File[] = [];

  //storing response result for uploaded files.
  uploadResult: any[] = [];

  constructor(private httpClient: HttpClient, private uploaderService: UploaderService) {
  }

  // updates all files which stored in cache to be uploaded to the server.
  updateStoredFiles(files: File[]) {
    this.files = files;
  }

  public getUploadResult(): any[] {
    return this.uploadResult;
  }

  // Does POST with file and lifetime.
  public putFile(lifetime: string): void {
    let postUrl = `${this.baseUrl}/api/put/${lifetime}`;
    this.files.forEach(file => {
      const data = new FormData();
      data.append('file', file);
      this.doPost(postUrl, data);
    });
  }

  private doPost(postUrl: string, data: any) {
    this.httpClient.post(postUrl, data).subscribe(
      (res) => {
        console.log(res);
        console.log(this.uploadResult);
        this.uploadResult.push(res);
        this.uploaderService.setLoaded(true);
      },
      (err) => {
        //todo: add correct error handling visible for user.
        console.log(err);
      }
    );
  }

  // Does GET for a file by provided id.
  getFile(id: string): Observable<any> {
    let getUrl = `${this.baseUrl}/api/get/${id}`;
    const HTTPOptions = {
      headers: new HttpHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
      }),
      'responseType': 'blob' as 'json'
    };

    return this.httpClient.get(getUrl, HTTPOptions);
  }

  // Does CHECK for a file by provided id. Expected answer is 200 HttpCode or 400.
  public checkFile(id: string): Observable<Object> {
    let checkUrl = `${this.baseUrl}/api/check/${id}`;
    return this.httpClient.get(checkUrl);
  }
}
