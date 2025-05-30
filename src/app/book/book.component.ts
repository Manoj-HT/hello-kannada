import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { ChapterDetailsService } from '../services/chapters/chapter-details.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import CONSTANTS from '../global/variables/constants';
import { ApiService } from '../services/api/api.service';
import { AppUpdateService } from '../services/app-update/app-update.service';
import { UserDataService } from '../services/user-data/user-data.service';

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
  updateService = inject(AppUpdateService)
  userDataservice = inject(UserDataService)

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.updateService.init();
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
