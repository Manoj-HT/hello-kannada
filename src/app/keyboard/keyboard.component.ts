import { Component, ElementRef, inject, input, output, Renderer2, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChapterDetailsService } from '../services/chapters/chapter-details.service';
@Component({
  selector: 'keyboard',
  imports: [ReactiveFormsModule],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss',
})
export class KeyboardComponent {
  chapterId = input<number>(0);
  word = output<string>();
  inputString = new FormControl('');
  el = inject(ElementRef);
  chapterDetailService = inject(ChapterDetailsService)
  changedVowels = [
    " ",
    "ಾ",
    "ಿ",
    "ೀ",
    "ು",
    "ೂ",
    "ೃ",
    "ೆ",
    "ೇ",
    "ೈ",
    "ೊ",
    "ೋ",
    "ೌ",
    "ಂ",
    "ಃ",
    "್",
  ];
  displayVowels = [
    "ಅ",
    "ಆ",
    "ಇ",
    "ಈ",
    "ಉ",
    "ಊ",
    "ಋ",
    "ಎ",
    "ಏ",
    "ಐ",
    "ಒ",
    "ಓ",
    "ಔ",
    "ಅಂ",
    "ಅಃ",
  ];
  vowels = signal(this.displayVowels);
  consonantGroup = signal([
    ["ಕ", "ಖ", "ಗ", "ಘ", "ಙ"], 
    ["ಚ", "ಛ", "ಜ", "ಝ", "ಞ"], 
    ["ಟ", "ಠ", "ಡ", "ಢ", "ಣ"], 
    ["ತ", "ಥ", "ದ", "ಧ", "ನ"], 
    ["ಪ", "ಫ", "ಬ", "ಭ", "ಮ"]
  ]);
  others = signal(["ಯ", "ರ", "ಲ", "ವ", "ಶ", "ಷ", "ಸ", "ಹ", "ಳ"]);
  ngOnInit() {
    const color = this.chapterDetailService.getColor(this.chapterId())
    this.el.nativeElement.style.setProperty('--keyboard-theme', color )
  }

  detectLanguage(str: string) {
    const kannadaRegex = /[\u0C80-\u0CFF]/;
    const englishRegex = /^[A-Za-z\s]+$/;
    if (kannadaRegex.test(str)) {
      return 'Kannada';
    } else if (englishRegex.test(str)) {
      return 'English';
    } else {
      return 'Mixed/Other';
    }
  }

  translate() {
    const str = this.inputString.value as string;
    const language = this.detectLanguage(str);
    if (language === 'English') {
      const url = `https://translate.google.com/?sl=en&tl=kn&text=${encodeURIComponent(
        str
      )}&op=translate`;
      window.open(url, '_blank');
    }
    if (language === 'Kannada') {
      const url = `https://translate.google.com/?sl=kn&tl=en&text=${encodeURIComponent(
        str
      )}&op=translate`;
      window.open(url, '_blank');
    }
    if (language === 'Mixed/Other') {
      alert(
        'Language not recognized. Please enter text in English or Kannada.'
      );
    }
  }

  addVowel(str: string) {
    let value = this.inputString.value;
    value = value + str;
    this.inputString.setValue(value);
  }

  addConsonant(str: string) {
    let value = this.inputString.value;
    this.vowels.update(() => this.changedVowels);
    value = value + str;
    this.inputString.setValue(value);
  }

  reset() {
    this.vowels.update(() => this.displayVowels);
  }

  addSpace() {
    const value = this.inputString.value;
    this.inputString.setValue(value + ' ');
  }

  add() {
    this.word.emit(this.inputString.value as string);
    navigator.clipboard.writeText(this.inputString.value as string)
  }

  clear(){
    const value = this.inputString.value as string;
    const split = value.split("");
        split.pop();
        let final = "";
        split.forEach((e) => {
          final = final + e;
        });

    this.inputString.setValue(final)
  }
}
