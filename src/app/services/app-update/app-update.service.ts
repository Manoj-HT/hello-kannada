import { inject, Injectable, signal } from '@angular/core';
import CONSTANTS from '../../global/variables/constants';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  private api = inject(ApiService);
  isAppUpdated = signal<{
    isReleased: boolean;
    isUpdated: boolean;
    changeLog: ChangeLog[]
  }>({
    isReleased: false,
    isUpdated: false,
    changeLog: []
  })

  init() {
    if (this.checkNextDay()) {
      this.loadAppConfig();
    }
    this.checkAppUpdated();
  }

  checkAppUpdated() {
    const appUpdated = localStorage.getItem(CONSTANTS.localStorageAppUpdated)
    if (appUpdated) {
      this.api.getChangeLog().subscribe({
        next: (res) => {
          this.isAppUpdated.update(() => ({
            isReleased: false,
            isUpdated: appUpdated === 'true',
            changeLog: this.parseChangelog(res)
          }))
          localStorage.setItem(CONSTANTS.localStorageLastUpdatedOn, String(Date.now()))
        },
      });
    }
  }

  reloadApp() {
    localStorage.setItem(CONSTANTS.localStorageAppUpdated, String(true))
    location.reload()
  }

  closeChangeLog() {
    localStorage.removeItem(CONSTANTS.localStorageAppUpdated)
  }

  parseChangelog(text: string): ChangeLog[] {
    const entries: ChangeLog[] = [];
    const parts = text.split(/^#\s+/gm).filter(Boolean);
    for (const part of parts) {
      const lines = part.trim().split('\n');
      const versionLine = lines[0].trim();
      const changes = lines
        .slice(1)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      entries.push({
        version: versionLine,
        changes,
      });
    }

    return entries;
  }

  checkNextDay(): boolean {
    const lastUpdatedOnString = localStorage.getItem(CONSTANTS.localStorageLastUpdatedOn)
    if (!lastUpdatedOnString) return true;
    const lastUpdatedOn = new Date(Number(lastUpdatedOnString))
    return lastUpdatedOn.toDateString() !== new Date().toDateString();
  }

  loadAppConfig(): void {
    this.api.getAppConfig().subscribe({
      next: (res) => {
        const appConfigString = localStorage.getItem(
          CONSTANTS.localStorageAppCofigKey
        );
        if (!appConfigString) {
          this.initApp(res);
        } else {
          this.updateApp(res);
        }
      },
    });
  }

  private initApp(appConfig: AppConfig) {
    localStorage.setItem(
      CONSTANTS.localStorageAppCofigKey,
      JSON.stringify(appConfig)
    );
    localStorage.setItem(CONSTANTS.localStorageLastUpdatedOn, String(Date.now()))
  }

  private updateApp(res: AppConfig) {
    const appConfigString = localStorage.getItem(
      CONSTANTS.localStorageAppCofigKey
    );
    const appConfig = JSON.parse(appConfigString as string) as AppConfig;
    const isNewApp =
      this.compareVersions(res.appVersion, appConfig.appVersion);
    const isNewContent =
      this.compareVersions(res.contentVersion, appConfig.contentVersion) === 1;
    if (isNewApp === 1) {
      this.isAppUpdated.update((res) => {
        return {
          isReleased: true,
          isUpdated: false,
          changeLog: []
        }
      })
    } else if (isNewApp == 0) {
      localStorage.setItem(CONSTANTS.localStorageAppCofigKey, JSON.stringify(res))
    }
    // TODO: read and display notification for content update
  }


  compareVersions(a: string, b: string) {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    const length = Math.max(aParts.length, bParts.length);
    for (let i = 0; i < length; i++) {
      const aNum = aParts[i] || 0;
      const bNum = bParts[i] || 0;

      if (aNum > bNum) return 1;
      if (aNum < bNum) return -1;
    }
    return 0;
  }
}
