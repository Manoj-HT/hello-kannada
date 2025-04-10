import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  keyboardClass = signal('keyboard-component keyboard-closed')
  chevronBtn = signal('keyboard-action-btn-chevron-closed')
  private isOpen = true

  openKeyBoard(){
    this.keyboardClass.update(() => this.isOpen ? 'keyboard-component keyboard-open' : 'keyboard-component keyboard-closed')
    this.chevronBtn.update(() => this.isOpen ? 'keyboard-action-btn-chevron-open' : 'keyboard-action-btn-chevron-closed')
    this.isOpen = !this.isOpen
  }
}
