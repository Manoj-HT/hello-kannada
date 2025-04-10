import { TestBed } from '@angular/core/testing';

import { ChapterDetailsService } from './chapter-details.service';

describe('ChapterDetailsService', () => {
  let service: ChapterDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChapterDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
