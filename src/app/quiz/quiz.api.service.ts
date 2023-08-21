import { Injectable } from '@angular/core';
import { Quiz, Question, Option } from 'src/app/quiz/model/quiz';

@Injectable({
  providedIn: 'root',
})
export class QuizzesService {
  readonly quizes: Quiz[] = 
  [
    new Quiz('Pakistan', [
      new Question(
        'Which city is the capital of Pakistan?', 
      [
        new Option('Karachi', false),
        new Option('Islamabad', true),
        new Option('Faisalabad', false),
      ]),
      new Question(
        "Which of the following is known as 'manchester of Pakistan'?",
        [
          new Option('Karachi', false),
          new Option('Islamabad', false),
          new Option('Faisalabad', true),
        ]
      ),
      new Question(
        "Which city is known as the 'city of lights'?", 
      [
        new Option('Karachi', true),
        new Option('Islamabad', false),
        new Option('Faisalabad', false),
      ]),
    ]),
    new Quiz('Ibrahim', [
      new Question(
        'Which University he studied in?', 
      [
        new Option('GIKI', false),
        new Option('FAST', true),
        new Option('GCU', false),
      ]),
      new Question(
        "Which bike does he have?",
        [
          new Option('Suzuki', false),
          new Option('Yamaha', false),
          new Option('Honda', true),
        ]
      ),
      new Question(
        "Which city he lived studied university in?", 
      [
        new Option('Lahore', true),
        new Option('Islamabad', false),
        new Option('Faisalabad', false),
      ]),
    ])
  ];

  getQuiz(quizId : number): Quiz {
    return this.quizes[quizId];
  }

  getQuestion(quizId : number, questionId : number) {
    const quiz = this.quizes[quizId]; 

    return {
      quiz: quiz,
      question: quiz.questions[questionId]
    }
  }
}
