export enum AnswerState {
    Correct,
    InCorrect,
    NotChosen
  }

export class Option{
    possible_answer : string = "";
    correct : boolean = false;
    selected: boolean = false;

    constructor(possible_answer : string, correct : boolean) {
        this.possible_answer = possible_answer;
        this.correct = correct;        
    }

    getState() : AnswerState {
        let state = AnswerState.NotChosen; 

        if (this.selected) {
            state = this.correct ? AnswerState.Correct : AnswerState.InCorrect; 
        } else if (this.correct){
            state = AnswerState.Correct;
        }

        return state;
    }
}
export class Question {
    statement: string = "";
    options: Option[] = [];
  
    constructor (statement: string, options: Option[]) {
        this.statement = statement;
        this.options = options;
        
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
    topics: string[] = [];
    questions: Question[] = [];
    finished: boolean = false;

    constructor (subject: string, information: string, topics: string[], questions: Question[]) {
        this.subject = subject;
        this.information = information;
        this.topics = topics;
        this.questions = questions;
    }

    isComplete() : boolean {
        return this.questions.every((q:Question) => q.isAttempted());
    }

    attemptedCount() : number{
        return this.questions.reduce(((count: number, q: Question)=>q.isAttempted() ? count+1 : count),0);
    }

    correctAnsweredCount() : number{
        return this.questions.reduce((count, question)=> question.isCorrectlyAnswered() ? count+1 : count, 0);
    } 
  }
