export class Option{
    possible_answer : string = "";
    correct : boolean = false;
    selected: boolean = false;

    constructor(possible_answer : string, correct : boolean) {
        this.possible_answer = possible_answer;
        this.correct = correct;        
    }
}
export class Question {
    statement: string = "";
    options: Option[] = [];
  
    constructor (statement: string, options: Option[]) {
        this.statement = statement;
        this.options = options;

        if(this.correctOptionCount() > 1) {
            throw new Error('Cannot have more than 1 correct option');
        }
        
    }

    correctOptionCount() : number {
        return this.options.reduce(((correctCount, option) => option.correct ? correctCount+1: correctCount), 0);
    }

    isAttempted() : boolean{
        return this.options.some(option => option.selected);
    }

    isCorrectlyAnswered() : boolean {
        return this.options.every((option)=>option.correct == option.selected);
    }
  }
  
  export class Quiz {
    subject: string = "";
    information: string = "";
    questions: Question[] = [];
    finished: boolean = false;

    constructor (subject: string, information: string, questions: Question[]) {
        this.subject = subject;
        this.information = information;
        this.questions = questions;
    }

    isComplete() : boolean {
        return this.questions.every((q:Question) => q.isAttempted);
    }

    attemptedCount() : number{
        return this.questions.reduce(((count: number, q: Question)=>q.isAttempted() ? count+1 : count),0);
    }

    correctAnsweredCount() : number{
        return this.questions.reduce((count, question)=> question.isCorrectlyAnswered() ? count+1 : count, 0);
    }
  }
