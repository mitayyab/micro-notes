import { Component, OnDestroy, OnInit } from '@angular/core';
import { Quiz, Question } from '../model/quiz';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizzesService } from '../quiz.api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit, OnDestroy {
  private paramsSubscription?: Subscription;

  quiz?: Quiz;
  question?: Question;
  // disableNext: boolean = false;
  // disablePrev: boolean = true;
  // disableFinish: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private quizApi: QuizzesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paramsSubscription = this.route.params.subscribe((params) => {
      const quizId = Number(params['quizID']);
      const questionId = Number(params['questionID']);

      const { quiz, question } = this.quizApi.getQuestion(quizId, questionId);

      this.quiz = quiz;
      this.question = question;
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }

  getProgress(): number {
    if (this.quiz) {
      return (this.quiz.attemptedCount() / this.quiz.questions.length) * 100;
    }
    return 0;
  }

  getNextQuestion(): void {
    const routeParams = this.route.snapshot.paramMap;

    const quizId = Number(routeParams.get('quizID'));
    const questionId = Number(routeParams.get('questionID'));

    if (
      this.quiz &&
      this.quiz.questions &&
      questionId + 1 < this.quiz?.questions.length
    ) {
      // this.disableNext = false;
      this.router.navigate(['quizes', quizId, 'questions', questionId + 1]);
    }
    else {
      // this.disableNext = true;
    }
  }

  getPrevQuestion(): void {
    const routeParams = this.route.snapshot.paramMap;

    const quizId = Number(routeParams.get('quizID'));
    const questionId = Number(routeParams.get('questionID'));

    if (questionId - 1 >= 0) {
      // this.disablePrev = false;
      this.router.navigate(['quizes', quizId, 'questions', questionId - 1]);
    }
    else
    {
      // this.disablePrev = true;
    }
  }

  getFinishQuiz() : void {
    const routeParams = this.route.snapshot.paramMap;

    const quizId = Number(routeParams.get('quizID'));

    if (
      this.quiz &&
      this.quiz.questions &&
      this.quiz.attemptedCount() == this.quiz.questions.length
    ) {
      // this.disableFinish = false;
      this.router.navigate(['quizes', quizId, 'result']);
    }
  }
}

