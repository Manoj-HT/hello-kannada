import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http = inject(HttpClient);

  api = {
    changelog: '/CHANGELOG.MD',
    appConfig: 'https://cdn.jsdelivr.net/gh/Manoj-HT/kannada-teacher@main/public/app-meta/app-config.json'
  }

  getAppConfig(): Observable<AppConfig>{
    return this.http.get<AppConfig>(this.api.appConfig)
  }

  getChangeLog(): Observable<string>{
    return this.http.get(this.api.changelog, {responseType: 'text'})
  }
}
