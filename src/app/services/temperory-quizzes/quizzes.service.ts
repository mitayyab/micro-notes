import { Injectable } from '@angular/core';
import { Quiz, Question, Option } from 'src/app/data-structures/quiz';

@Injectable({
  providedIn: 'root',
})
export class QuizzesService {
  constructor() {
    const question1Options = [
      new Option('Karachi', false),
      new Option('Islamabad', true),
      new Option('Faisalabad', false),
    ];

    const question2Options = [
      new Option('Karachi', false),
      new Option('Islamabad', false),
      new Option('Faisalabad', true),
    ];

    const question3Options = [
      new Option('Karachi', true),
      new Option('Islamabad', false),
      new Option('Faisalabad', false),
    ];

    const questions = [
      new Question('Which city is the capital of Pakistan?', question1Options),
      new Question(
        "Which of the following is known as 'manchester of Pakistan'?",
        question2Options
      ),
      new Question(
        "Which planet is known as the 'city of lights'?",
        question3Options
      ),
    ];

    const quiz1 = new Quiz ("Pakistan", questions);
  }
}
