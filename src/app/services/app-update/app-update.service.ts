import { inject, Injectable, signal, effect, computed } from '@angular/core';
import CONSTANTS from '../../global/variables/constants';
import { ApiService } from '../api/api.service';
import { UserDataService } from '../user-data/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  private api = inject(ApiService);
  private userData = inject(UserDataService)

  /**
   * Signal to hold value of update
   */
  isAppUpdated = signal<{
    isReleased: boolean;
    isUpdated: boolean;
    changeLog: ChangeLog[];
    isCritical: boolean;
  }>({
    isReleased: false,
    isUpdated: false,
    changeLog: [],
    isCritical: false
  });
  private counter = 0;

  /**
   * Initialize update sequence
   */
  init() {
    if (this.checkNextDay()) {
      if (!navigator.onLine) {
        console.warn("Offline mode, App update check terminated");
        return;
      }
      this.loadAppConfig();
    }
    this.initializeCounter();
    this.checkAppUpdated();
  }

  // counter variable to hold the amount of times modal was shown
  private initializeCounter() {
    const counter = localStorage.getItem(CONSTANTS.localStorageUpdateCounter);
    if (counter) {
      this.counter = Number.isInteger(parseInt(counter)) ? parseInt(counter) : 0;
    } else {
      localStorage.setItem(CONSTANTS.localStorageUpdateCounter, String(0));
    }
  }

  /**
   * To get the amount of times updates were declined
   * @returns {number} counter
   */
  getUpdateDeclinedCount() {
    return this.counter;
  }

  /**
   * Checks if app has been updated.
   * Value available in isAppUpdated signal
   */
  checkAppUpdated() {
    const appUpdated = localStorage.getItem(CONSTANTS.localStorageAppUpdated);
    if (appUpdated) {
      localStorage.setItem(CONSTANTS.localStorageUpdateCounter, String(0));
      this.api.getChangeLog().subscribe({
        next: (res) => {
          this.isAppUpdated.update((prev) => ({
            isReleased: false,
            isUpdated: appUpdated === 'true',
            changeLog: this.parseChangelog(res),
            isCritical: false,
          }));
          localStorage.setItem(CONSTANTS.localStorageLastUpdatedOn, String(Date.now()));
        },
        error: (err: Error) => {
          err.message = "Could not obtain changelog";
          console.error(err);
        }
      });
    }
  }

  /**
   * Flush and update app via reload
   */
  reloadApp(isCritical: boolean) {
    localStorage.setItem(CONSTANTS.localStorageAppUpdated, String(true));
    if (isCritical) {
      console.warn("Critcal update, Forcing reload");
    }
    location.reload();
  }

  /**
   * Close change log modal on screen
   */
  closeChangeLog() {
    localStorage.removeItem(CONSTANTS.localStorageAppUpdated);
  }

  /**
   * To change Changelog into readable format
   * @param text takes chanelog text
   * @returns ChangeLog[]
   */
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

  /**
   * Makes sure that app update runs only once per day 
   * when app is open
   * @returns boolean
   */
  checkNextDay(): boolean {
    const lastUpdatedOnString = localStorage.getItem(CONSTANTS.localStorageLastUpdatedOn);
    if (!lastUpdatedOnString) return true;
    const lastUpdatedOn = new Date(Number(lastUpdatedOnString));
    return lastUpdatedOn.toDateString() !== new Date().toDateString();
  }

  /**
   * Loads app config from Cloud,
   * updates or initializes the app
   */
  loadAppConfig(): void {
    this.api.getAppConfig().subscribe({
      next: (res) => {
        const appConfigString = localStorage.getItem(
          CONSTANTS.localStorageAppCofigKey
        );
        if (!appConfigString) {
          this.initApp(res);
        } else {
          this.update(res);
        }
      },
      error: (err: Error) => {
        err.message = "Could not recieve config";
        console.error(err);
      }
    });
  }

  // runs for the first time - persists latest app config
  private initApp(appConfig: AppConfig) {
    localStorage.setItem(
      CONSTANTS.localStorageAppCofigKey,
      JSON.stringify(appConfig)
    );
    localStorage.setItem(CONSTANTS.localStorageLastUpdatedOn, String(Date.now()));
  }

  // updates the isAppUpdated signal
  private update(newConfig: AppConfig) {
    const appConfigString = localStorage.getItem(
      CONSTANTS.localStorageAppCofigKey
    );
    const appConfig = JSON.parse(appConfigString as string) as AppConfig;
    const isNewApp =
      this.compareVersions(newConfig.appVersion, appConfig.appVersion);
    const isNewContent =
      this.compareVersions(newConfig.contentVersion, appConfig.contentVersion) === 1;
    this.updateApp(newConfig, isNewApp);
    // TODO: read and display notification for content update
  }

  // updates the code part of the app
  private updateApp(newConfig: AppConfig, isNewApp: -1 | 0 | 1) {
    if (isNewApp === 1) {
      if (newConfig.isCritical) {
        this.reloadApp(true);
      }
      this.isAppUpdated.update(() => {
        return {
          isReleased: true,
          isUpdated: false,
          changeLog: [],
          isCritical: newConfig.isCritical
        };
      });
    } else if (isNewApp == 0) {
      localStorage.setItem(CONSTANTS.localStorageAppCofigKey, JSON.stringify(newConfig));
    }
  }

  // run only if the update was declined
  declineUpdate() {
    this.initializeCounter();
    this.counter += 1;
    localStorage.setItem(CONSTANTS.localStorageUpdateCounter, String(this.counter));
  }

  /**
   * Utility function to compare versions
   * @param a string of format xx.xx.xx where x is 0-9
   * @param b string of format xx.xx.xx where x is 0-9
   * @returns -1: B is higher | 0: Same version | 1: A is higher
   */
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
