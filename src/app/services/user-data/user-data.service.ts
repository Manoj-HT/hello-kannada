import { inject, Injectable, signal } from '@angular/core';
import CONSTANTS from '../../global/variables/constants';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  userData = signal<UserData>({
    lastCompletedChapter: '',
    skippedChapters: [],
    syncLink: "",
    updatedAt: Date.now()
  });
  loadState = signal<'idle' | 'loading' | 'loaded' | 'error'>('idle');


  /**
   * Initiate loading user data from local storage
   */
  load() {
    this.loadState.set('loading');
    this.loadUserData();
  }

  private loadUserData() {
    const localStorageUserData = localStorage.getItem(CONSTANTS.localStorageProgressKey);
    let userData: UserData;
    if (localStorageUserData) {
      userData = JSON.parse(localStorageUserData);
      this.userData.update(() => userData);
    } else {
      userData = {
        lastCompletedChapter: "",
        skippedChapters: [],
        syncLink: "",
        updatedAt: Date.now()
      };
      localStorage.setItem(CONSTANTS.localStorageProgressKey, JSON.stringify(userData));
      this.userData.update(() => userData);
    }
  }

  /**
   * Gives if the chapter can be accessed
   */
  canAccessChapter(chapterId: string): boolean {
    if (chapterId <= this.userData().lastCompletedChapter) return true;
    if (this.userData().skippedChapters.length >= 10) return false;
    return true;
  }

  /**
   * Save progress of chapter completion
   */
  saveProgress(newCompletedChapter: string) {
    const updatedData = {
      ...this.userData(),
      lastCompletedChapter: newCompletedChapter,
      updatedAt: Date.now()
    };
    this.userData.set(updatedData);
    localStorage.setItem(CONSTANTS.localStorageProgressKey, JSON.stringify(updatedData));
  }

  private getDataFromSyncLink() {

  }

  private syncFromLink(syncData: UserData) {
    const currentData = this.userData();
    if (syncData.updatedAt > currentData.updatedAt) {
      this.userData.set(syncData);
      localStorage.setItem(CONSTANTS.localStorageProgressKey, JSON.stringify(syncData));
    }
  }

/**
 * update sync link to local
 */
  setSyncLink(link: string) {
    const updatedData = {
      ...this.userData(),
      syncLink: link
    };
    this.userData.set(updatedData);
    localStorage.setItem(CONSTANTS.localStorageProgressKey, JSON.stringify(updatedData));
  }


  /**
   * download user data as a json
   */
  downloadUserData() {
    const dataStr = JSON.stringify(this.userData(), null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "userData.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  // TODO: expose a method to block accesing further chapters based on progress
  // TODO: Create a signal for load state to expose it to app-update
  // TODO: expose method to save chapter progress updating to progress
  // TODO: If syncLink available take data from sync link and compare from local storage, update localStorage only if syncLink data is farther
  // TODO: expose a method to download userData
  // TODO: expose method to set synclink
}
