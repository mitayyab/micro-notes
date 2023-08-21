import { Component } from '@angular/core';
import { QuizzesService } from '../quiz.api.service';
import { ActivatedRoute } from '@angular/router';
import { Quiz } from '../model/quiz';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent {
  quiz?: Quiz;

  constructor(private quizApi: QuizzesService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const quizIdParam = this.route.snapshot.paramMap.get('quizID');
    const quizId = quizIdParam ? +quizIdParam : 0;

    this.quiz = this.quizApi.getQuiz(quizId);
  }

  getQuizSubject(): string {
    if (this.quiz) {
      return this.quiz.subject;
    } else {
      return 'Did not find the quiz';
    }
  }

  getQuizInformation(): string {
    if (this.quiz) {
      return this.quiz.information;
    } else {
      return 'Did not find the quiz';
    }
  }

  getTotalQuizQuestions() : number {
    if (this.quiz) {
      return this.quiz.questions.length
    } else {
      return 0;
    }
  }

  getCorrectAnsweredQuestions() : number {
    if (this.quiz) {
      return this.quiz.correctAnsweredCount();
    } else {
      return 0;
    }
  }

  getIncorrectAnsweredQuestions() : number {
    if (this.quiz) {
      return this.quiz.questions.length - this.quiz.correctAnsweredCount();
    } else {
      return 0;
    }
  }

  getResultInPercentage() : number {
    if (this.quiz) {
      return (this.getCorrectAnsweredQuestions()/this.getIncorrectAnsweredQuestions()) * 100;
    } else {
      return 0;
    }
  }
}
