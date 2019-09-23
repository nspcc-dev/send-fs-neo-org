import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";


@Injectable()
export class FileStoreService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
  }

  // Does POST with file and lifetime.
  putFile(file: File, lifetime: string): Observable<Object> {
    //todo: figure out where to put lifetime
    let postUrl = this.baseUrl + "/api/putObject";
    let data = new FormData();
    data.append('file', file);

    return this.httpClient.post(postUrl, data);
  }

  // Does GET for a file by provided id.
  getFile(id: string): Observable<Object>{
    let getUrl = this.baseUrl + "/api/getObject";

    return this.httpClient.get(getUrl + "/" + id);
  }
}
