export class PersonInfo{
    name : string = "";
    email : string = "";

    constructor(name : string, email : string) {
        this.name = name;
        this.email = email;        
    }
}
export class Option{
    possible_answer : string = "";
    correct : boolean = false;

    constructor(possible_answer : string, correct : boolean) {
        this.possible_answer = possible_answer;
        this.correct = correct;        
    }
}
export class Question {
    statement: string = "";
    options: Option[] = [];
    attempted: boolean = false;
  
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
  }
  
  export class Quiz {
    subject: string = "";
    questions: Question[] = [];

    constructor (subject: string, questions: Question[]) {
        this.subject = subject;
        this.questions = questions;
    }

    isComplete() : boolean {
        return this.questions.every((q:Question) => q.attempted);
    }

    attemptedCount() : number{
        return this.questions.reduce(((count: number, q: Question)=>q.attempted ? count+1 : count),0);
    }
  }
