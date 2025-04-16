import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ChapterDetailsService } from '../services/chapters/chapter-details.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import CONSTANTS from '../global/variables/constants';

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

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    // check for latest app version
    // save index data
    // from index data loadUserdata
    this.loadUserData();
  }



  loadUserData(){
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
