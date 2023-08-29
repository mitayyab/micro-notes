export enum AnswerState {
   Correct,
   InCorrect,
   NotChosen,
}

export class AnswerChoice {
   readonly text: string = '';
   readonly correct: boolean = false;
   selected: boolean = false;

   constructor(text: string, correct: boolean) {
      this.text = text;
      this.correct = correct;
   }

   getState(): AnswerState {
      let state = AnswerState.NotChosen;

      if (this.selected) {
         state = this.correct ? AnswerState.Correct : AnswerState.InCorrect;
      }

      return state;
   }
}

export class Question {
   readonly text: string = '';
   readonly answerChoices: AnswerChoice[] = [];

   constructor(text: string, options: AnswerChoice[]) {
      this.text = text;
      this.answerChoices = options;
   }

   isAttempted(): boolean {
      return this.answerChoices.some(option => option.selected);
   }

   isCorrectlyAnswered(): boolean {
      return this.answerChoices.every(
         option => option.correct == option.selected,
      );
   }
}

export class Quiz {
   readonly title: string = '';
   readonly description: string = '';
   readonly topics: string[] = [];
   readonly questions: Question[] = [];
   finished: boolean = false;

   constructor(
      subject: string,
      description: string,
      topics: string[],
      questions: Question[],
   ) {
      this.title = subject;
      this.description = description;
      this.topics = topics;
      this.questions = questions;
   }

   isComplete(): boolean {
      return this.questions.every((q: Question) => q.isAttempted());
   }

   getAttemptedCount(): number {
      return this.questions.filter((q: Question) => q.isAttempted()).length;
   }

   getCorrectlyAnsweredCount(): number {
      return this.questions.filter((q: Question) => q.isCorrectlyAnswered())
         .length;
   }
}
