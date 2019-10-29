import {Injectable} from "@angular/core";

@Injectable()
export class UploaderService {
  loading = false;
  loaded = false;

  public setLoading(state: boolean): void {
    this.loading = state;
  }

  public setLoaded(state: boolean): void {
    this.loaded = state;
    //this.loading = false;
  }

  public isLoading(): boolean {
    return this.loading;
  }

  public isLoaded(): boolean {
    return this.loaded;
  }
}

// Add list for uploading files to here.
// Remove on success or error
// 
