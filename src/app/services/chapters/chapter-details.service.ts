import { Injectable } from '@angular/core';
import { menuSVG } from './icons';

@Injectable({
  providedIn: 'root',
})
export class ChapterDetailsService {
  chapterDetail = [
    {
      title: "Understanding the app",
      icon: menuSVG,
      id: 1,
      gridPlacement: 2,
      noOfChapters: 3
    },
    {
      title: "Understanding the app",
      icon: menuSVG,
      id: 1,
      gridPlacement: 3,
      noOfChapters: 3
    },
    {
      title: "Understanding the app",
      icon: menuSVG,
      id: 1,
      gridPlacement: 4,
      noOfChapters: 3
    },
    {
      title: "Understanding the app",
      icon: menuSVG,
      id: 1,
      gridPlacement: 3,
      noOfChapters: 3
    },
    
  ];
  backgroundColor = [
    'var(--pastel-pink)',
    'var(--pastel-orange)',
    'var(--pastel-blue)',
    'var(--pastel-purple)',
    'var(--pastel-yellow)',
  ];

  getColor(index:number){
    return this.backgroundColor[index % 5];
  }
}
