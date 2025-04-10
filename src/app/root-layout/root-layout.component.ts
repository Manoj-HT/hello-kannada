import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ChapterDetailsService } from '../services/chapters/chapter-details.service';
import { Router } from '@angular/router';

@Component({
  selector: 'root-layout',
  imports: [],
  templateUrl: './root-layout.component.html',
  styleUrl: './root-layout.component.scss'
})
export class RootLayoutComponent {
  updateableIndex!: number
  chapterDetail = inject(ChapterDetailsService)
  chapters = this.chapterDetail.chapterDetail
  route = inject(Router)

  handleChapterClick(index: number, event: Event){
    this.updateableIndex = index
    const div = event.target as HTMLDivElement
    setTimeout(() => {
      this.route.navigate(['chapter', index])
    }, 700);
  }
  getCssValue(index: number, chapter: any){
    const color = this.chapterDetail.getColor(index)
    return `grid-row: ${index + 1}; 
            grid-column: ${chapter.gridPlacement};
            border-color: ${color};
            background-color: ${color}`
  }

  getImagesvgString(svgString: string){
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  }

}
