import { Injectable } from '@angular/core';
import { Quiz, Question, Option } from 'src/app/quiz/model/quiz';

@Injectable({
  providedIn: 'root',
})
export class QuizzesService {
  readonly quiz: Quiz = new Quiz('Pakistan', [
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
      "Which planet is known as the 'city of lights'?", 
    [
      new Option('Karachi', true),
      new Option('Islamabad', false),
      new Option('Faisalabad', false),
    ]),
  ]);

  getQuiz(): Quiz {
    return this.quiz;
  }
}
