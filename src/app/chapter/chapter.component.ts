import { Component, computed, inject, input, signal } from '@angular/core';
import { ChapterDetailsService } from '../services/chapters/chapter-details.service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'chapter',
  imports: [],
  templateUrl: './chapter.component.html',
  styleUrl: './chapter.component.scss',
})
export class ChapterComponent {
  id = input('');
  chapterDetail = inject(ChapterDetailsService);
  route = inject(Router);
  chapterNumber = computed(() => Number(this.id()) + 1);
  chapterPage = signal('chapter-page');
  ngOnInit() {
    this.enableTopic();
  }

  topicArray = signal<number[]>([]);
  getBackgroundColor() {
    if (!this.id()) return 'background-color: transparent';
    return `background-color: ${this.chapterDetail.getColor(
      Number(this.id())
    )}`;
  }

  enableTopic() {
    const array = new Array(16);
    let i = 0;
    const delayInterval = setInterval(() => {
      this.topicArray.update((arr) => [...arr, array[i]]);
      i = i + 1;
      if (i == array.length) {
        clearInterval(delayInterval);
      }
    }, 50);
  }

  goBack() {
    this.chapterPage.update(() => {
      setTimeout(() => {
        this.route.navigate(['book']);
      }, 300);
      return 'chapter-page close-animation';
    });
  }

  gotoTopic(index: number){
    this.route.navigate(['chapter',this.id(),'topic', index])
  }
}
