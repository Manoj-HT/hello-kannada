import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { ChapterDetailsService } from '../services/chapters/chapter-details.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import CONSTANTS from '../global/variables/constants';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'book',
  imports: [],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss'
})
export class BookComponent {

  updateableIndex!: number
  chapterDetail = inject(ChapterDetailsService)
  chapters = this.chapterDetail.chapterDetail
  route = inject(Router)
  platformId = inject(PLATFORM_ID)
  api = inject(ApiService);
  isAppUpdated = signal<{
    isReleased: boolean;
    isUpdated: boolean;
    changeLog: ChangeLog[]
  }>({
    isReleased: false,
    isUpdated: false,
    changeLog: []
  })

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadAppConfig();
    this.loadUserData();
    this.checkAppUpdated()
  }


  loadAppConfig() {
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

  initApp(appConfig: AppConfig) {
    localStorage.setItem(
      CONSTANTS.localStorageAppCofigKey,
      JSON.stringify(appConfig)
    );
  }

  updateApp(res: AppConfig) {
    const appConfigString = localStorage.getItem(
      CONSTANTS.localStorageAppCofigKey
    );
    const appConfig = JSON.parse(appConfigString as string) as AppConfig;
    const isNewApp =
      this.compareVersions(res.appVersion, appConfig.appVersion) === 1;
    const isNewContent =
      this.compareVersions(res.contentVersion, appConfig.contentVersion) === 1;
    if (isNewApp) {
      this.isAppUpdated.update((res) => {
        return {
          isReleased: true,
          isUpdated: false,
          changeLog: []
        }
      })
      localStorage.setItem(CONSTANTS.localStorageAppUpdated, String(true))
      localStorage.setItem(CONSTANTS.localStorageAppCofigKey, JSON.stringify(res))
    }

    // TODO: update `localStorage`
    // TODO: read and display notification for content update
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
          localStorage.removeItem(CONSTANTS.localStorageAppUpdated)
        },
      });
    }
  }

  reloadApp() {
    location.reload()
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

  loadUserData() {
    const localStorageUserData = localStorage.getItem(CONSTANTS.localStorageProgressKey)
    let userData: UserData;
    if (localStorageUserData) {
      userData = JSON.parse(localStorage.getItem(CONSTANTS.localStorageProgressKey) as string)
    } else {
      userData = {
        progress: {
          "b1:c1:t1": {
            completed: false,
            lastAttemptAt: Date.now(),
            firstAttemptAt: Date.now(),
          }
        },
        syncLink: "",
      }
      localStorage.setItem(CONSTANTS.localStorageProgressKey, JSON.stringify(userData))
    }
  }

  handleChapterClick(index: number, event: Event) {
    this.updateableIndex = index
    const div = event.target as HTMLDivElement
    setTimeout(() => {
      this.route.navigate(['chapter', index])
    }, 700);
  }

  getCssValue(index: number, chapter: any) {
    const color = this.chapterDetail.getColor(index)
    return `grid-row: ${index + 1}; 
            grid-column: ${chapter.gridPlacement};
            border-color: ${color};
            background-color: ${color}`
  }

  getImagesvgString(svgString: string) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  }

}
