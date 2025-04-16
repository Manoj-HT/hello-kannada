import { Component, inject, input, signal } from '@angular/core';
import { KeyboardComponent } from '../../keyboard/keyboard.component';
import { KeyboardService } from '../../services/keyboard/keyboard.service';
import { AudioService } from '../../services/audio/audio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'interactive-topic',
  imports: [KeyboardComponent],
  templateUrl: './interactive.component.html',
  styleUrl: './interactive.component.scss'
})
export class InteractiveComponent {
  topicId = input();
  chapterId = input<number>(0);
  keyBoardService = inject(KeyboardService)
  audioService = inject(AudioService)
  route = inject(Router)
  ngOnInit() {
    // this.audioService.speakKannada("ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?")
    // this.audioService.speakKannada("Hi How are you")
  }


  addWord(value: string) {
    console.log(value);
  }

  goBack() {
    this.route.navigate(["chapter", this.chapterId()])
  }
}
