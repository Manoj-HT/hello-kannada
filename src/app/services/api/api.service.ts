import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http = inject(HttpClient)

  getAppVersion(): Observable<string>{
    return this.http.get("").pipe(map( (result) => ""))
  }
}
