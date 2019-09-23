import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Lifetime} from "../selector-and-push/selector-and-push.component";


@Injectable()
export class FileStoreService {

  baseUrl = environment.baseUrl;
  files = [];

  constructor(private httpClient: HttpClient) {
  }

  // updates all files which stored in cache to be uploaded to the server.
  updateStoredFiles(files: File[]) {
    this.files = files;
  }

  // Does POST with file and lifetime.
  putFile(lifetime: string): Observable<Object> {
    console.log("sending file with lifetime = " + lifetime);
    //todo: figure out where to put lifetime
    let postUrl = this.baseUrl + "/api/putObject";
    let data = new FormData();
    data.append('file', this.files[0]);

    return this.httpClient.post(postUrl, data);
  }

  // Does GET for a file by provided id.
  getFile(id: string): Observable<Object>{
    let getUrl = this.baseUrl + "/api/getObject";

    return this.httpClient.get(getUrl + "/" + id);
  }
}
