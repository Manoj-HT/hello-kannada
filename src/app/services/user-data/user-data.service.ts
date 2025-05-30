import { Injectable, signal } from '@angular/core';
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
      })

  /**
   * Initiate loading user data from local storage
   */
  load(){

  }

  private loadUserData() {
    const localStorageUserData = localStorage.getItem(CONSTANTS.localStorageProgressKey)
    let userData: UserData;
    if (localStorageUserData) {
      userData = JSON.parse(localStorageUserData)
    } else {
      userData = {
       lastCompletedChapter: '',
       skippedChapters: [],
        syncLink: "",
        updatedAt: Date.now()
      }
      localStorage.setItem(CONSTANTS.localStorageProgressKey, JSON.stringify(userData))
    }
  }

  // TODO: load userData from local storage
  // TODO: expose a method to block accesing further chapters based on progress
  // TODO: Create a signal for load state to expose it to app-update
  // TODO: expose method to save chapter progress updating to progress
  // TODO: If syncLink available take data from sync link and compare from local storage
  // TODO: expose signal to book component to overwrite localStorage or synclink data (Provide suggestion)
  // TODO: expose a method to read json user data and then overwrite local storage data
  // TODO: expose a method to download userData
  // TODO: expose method to set synclink
}
