type InteractiveQuestionBase = {
  id: string;
  type: InteractiveQuestionType;
  prompt?: string;
  imageSrc?: string;
  imageAlt?: string;
};

type MCQQuestion = InteractiveQuestionBase & {
  type: 'mcq';
  question: string;
  options: string[];
  answer: string;
};

type ArrangeQuestion = InteractiveQuestionBase & {
  type: 'arrange';
  sentence: string;
  options: string[];
  answer: string[];
};

type FillQuestion = InteractiveQuestionBase & {
  type: 'fill';
  sentence: string;
  answer: string | string[];
};

type ListenWriteQuestion = InteractiveQuestionBase & {
  type: 'listen-write';
  sentence: string;
  answer: string;
};

type ListenChoiceQuestion = InteractiveQuestionBase & {
  type: 'listen-choice';
  sentence: string;
  options: string[];
  answer: string;
};

type ListenStoryQuestion = InteractiveQuestionBase & {
  type: 'listen-story';
  story: string;
  options: string[];
  answer: string;
};

type SpeakCheckQuestion = InteractiveQuestionBase & {
  type: 'speak-check';
  sentence: string;
  answer: string;
};

type MatchQuestion = InteractiveQuestionBase & {
  type: 'match';
  pairs: Record<string, string>;
};

type TrueFalseQuestion = InteractiveQuestionBase & {
  type: 'true-false';
  story: string;
  statement: string;
  answer: boolean;
};

type SelectMultipleQuestion = InteractiveQuestionBase & {
  type: 'select-multiple';
  question: string;
  options: string[];
  answers: string[];
};

type ImageChoiceQuestion = InteractiveQuestionBase & {
  type: 'image-choice';
  question: string;
  options: { src: string; alt: string }[];
  answerAlt: string;
};

type InteractiveQuestion =
  | MCQQuestion
  | ArrangeQuestion
  | FillQuestion
  | ListenWriteQuestion
  | ListenChoiceQuestion
  | ListenStoryQuestion
  | SpeakCheckQuestion
  | MatchQuestion
  | TrueFalseQuestion
  | SelectMultipleQuestion
  | ImageChoiceQuestion;

type TopicInteractive = {
  id: string;
  name: string;
  questions: InteractiveQuestion[];
};

