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
  nextBtnMsg: string = 'Next';

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

  getNextBtnMsg(): string {
    if (this.quiz?.attemptedCount() == this.quiz?.questions.length) {
      this.nextBtnMsg = 'Finish';
    } else {
      this.nextBtnMsg = 'Next';
    }
    return this.nextBtnMsg;
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
      this.router.navigate(['quizes', quizId, 'questions', questionId + 1]);
    }
  }

  getPrevQuestion(): void {
    const routeParams = this.route.snapshot.paramMap;

    const quizId = Number(routeParams.get('quizID'));
    const questionId = Number(routeParams.get('questionID'));

    if (questionId - 1 >= 0) {
      this.router.navigate(['quizes', quizId, 'questions', questionId - 1]);
    }
  }
}

