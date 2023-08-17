import { Injectable } from '@angular/core';
import { Quiz, Question, Option } from 'src/app/quiz/model/quiz';

@Injectable({
  providedIn: 'root',
})
export class QuizzesService {
  question2Options = [
    new Option('Karachi', false),
    new Option('Islamabad', false),
    new Option('Faisalabad', true),
  ];

  question3Options = [
    new Option('Karachi', true),
    new Option('Islamabad', false),
    new Option('Faisalabad', false),
  ];

  readonly quiz: Quiz = new Quiz('Pakistan', [
    new Question('Which city is the capital of Pakistan?', [
      new Option('Karachi', false),
      new Option('Islamabad', true),
      new Option('Faisalabad', false),
    ]),
    new Question(
      "Which of the following is known as 'manchester of Pakistan'?",
      this.question2Options
    ),
    new Question(
      "Which planet is known as the 'city of lights'?",
      this.question3Options
    ),
  ]);

  getQuiz(): Quiz {
    return this.quiz;
  }
}
