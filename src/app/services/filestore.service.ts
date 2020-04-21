import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {UploaderService} from "./uploader.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Injectable()
export class FileStoreService {

  baseUrl = environment.baseUrl;
  //storing files to be uploaded.
  files: File[] = [];

  //storing response result for uploaded files.
  uploadResult: any[] = [];
  cid: any;

  constructor(
    private httpClient: HttpClient,
    private uploaderService: UploaderService,
    private notification: MatSnackBar,
    private router: Router) {
  }

  // updates all files which stored in cache to be uploaded to the server.
  updateStoredFiles(files: File[]) {
    this.files = files;
  }

  public getFiles(): any {
    return this.files;
  }

  public getCid(): any {
    return this.cid;
  }

  public setCid(): any {
    let cidUrl = `${this.baseUrl}/api/container/`;
    
    this.httpClient.get(cidUrl).subscribe(
      (res) => {
        this.cid = res["cid"]
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public getUploadResult(): any[] {
    return this.uploadResult;
  }

  public filesAdded(): boolean {
    return this.files.length > 0;
  }

  // Does POST with file and lifetime.
  public putFile(lifetime: string): void {
    let postUrl = `${this.baseUrl}/api/put/${lifetime}/`;

    this.files.forEach(file => {
      

      const data = new FormData();
      data.append('file', file);
      this.doPost(postUrl, data, file.name, file);

    });

 
  }

 

  private doPost(postUrl: string, data: any, filename: string, file: any) {
    this.httpClient.post(postUrl, data).subscribe(
      (res) => {
        
        console.log(res);
        console.log(this.uploadResult);
        this.uploadResult.push(res);
        this.uploaderService.setLoaded(true);

        this.files = this.files.filter(obj => obj !== file);

        if (this.files.length == 0) {
          this.uploaderService.setLoading(false);
        }
      },
      (err) => {
        
        let snack = this.notification.open(`Something went wrong with uploading file: ${filename}`, "DETAILS", {duration: 5000});
        snack.onAction().subscribe(() => {
          this.router.navigateByUrl("/not-found", {state: {data: `Something went wrong with uploading file: ${filename}. Error = ${err.message}`}})
        });

        console.log(err);
        this.uploaderService.setLoaded(false);

        if (this.files.length == 1) {
          this.uploaderService.setLoading(false);
        }
       // this.uploaderService.setLoading(false);

        //this.files = this.files.filter(obj => obj !== file);
        
      }
    );
  }

  // Does GET for a file by provided id.
  public getFile(id: string): Observable<any> {
    let getUrl = `${this.baseUrl}/api/get/${id}/`;
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
    let checkUrl = `${this.baseUrl}/api/check/${id}/`;
    return this.httpClient.get(checkUrl);
  }
}
