import { Component, OnDestroy, OnInit } from '@angular/core';
import { Quiz, Question, Option, AnswerState } from '../model/quiz';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizzesService } from '../quiz.api.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit, OnDestroy {
    private paramsSubscription?: Subscription;

    quiz?: Quiz;
    question?: Question;
    btnWords: string = 'Finish';

    constructor(
        private route: ActivatedRoute,
        private quizApi: QuizzesService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.paramsSubscription = this.route.params.subscribe((params) => {
            const quizId = Number(params['quizID']);
            const questionId = Number(params['questionID']);

            const { quiz, question } = this.quizApi.getQuestion(
                quizId,
                questionId
            );

            this.quiz = quiz;
            this.question = question;
        });
    }

    ngOnDestroy(): void {
        this.paramsSubscription?.unsubscribe();
    }

    getProgress(): number {
        if (this.quiz) {
            return (
                (this.quiz.attemptedCount() / this.quiz.questions.length) * 100
            );
        }
        return 0;
    }

    showNextBtn(): boolean {
      const routeParams = this.route.snapshot.paramMap;

      const questionId = Number(routeParams.get('questionID'));

      if ( this.quiz && this.quiz.questions && (questionId + 1 < this.quiz?.questions.length) ) {
        return true;
      } 

      return false;
    }

    getNextQuestion(): void {
        const routeParams = this.route.snapshot.paramMap;

        const quizId = Number(routeParams.get('quizID'));
        const questionId = Number(routeParams.get('questionID'));
        
        if ( this.quiz && this.quiz.questions && questionId + 1 < this.quiz?.questions.length ) {
            this.router.navigate(['quizes',  quizId,  'questions', questionId + 1, ]);
        } 
    }

    showPrevBtn() : boolean {
      const routeParams = this.route.snapshot.paramMap;

      const questionId = Number(routeParams.get('questionID'));
      
      if (this.quiz && this.quiz.questions && questionId > 0) {
        return true;
      } 

      return false;
    }

    getPrevQuestion(): void {
        const routeParams = this.route.snapshot.paramMap;

        const quizId = Number(routeParams.get('quizID'));
        const questionId = Number(routeParams.get('questionID'));

        if (this.quiz && this.quiz.questions && questionId - 1 >= 0) {
            this.router.navigate(['quizes', quizId, 'questions', questionId - 1, ]);
        } 
    }

    finishQuizAndShowResult(): void {
        const routeParams = this.route.snapshot.paramMap;
        const quizId = Number(routeParams.get('quizID'));

        if (
            this.quiz && this.quiz.isComplete()
        ) {
            this.quiz.finished = true;
            this.router.navigate(['quizes', quizId, 'result']);
        }
    }

    toShowResultButton(): boolean{
      return (this.quiz?.isComplete() && !this.quiz?.finished) || false;
    }

    getAnswerStateClass(option: Option) {
        return this.quiz?.finished
            ? _.kebabCase(AnswerState[option.getState()])
            : '';
    }

    getAnswerStateIconClass(option: Option) {
        let className = '';

        if (this.quiz?.finished) {
            switch (option.getState()) {
                case AnswerState.Correct:
                    className = 'fa-circle-check';
                    break;
                case AnswerState.InCorrect:
                    className = 'fa-circle-xmark';
                    break;
            }
        }

        return className;
    }

    getAnswerStateBorderClass(option: Option) {
        let className = '';

        if (this.quiz?.finished) {
            switch (option.getState()) {
                case AnswerState.Correct:
                    className = 'border-success';
                    break;
                case AnswerState.InCorrect:
                    className = 'border-danger';
                    break;
            }
        }

        return className;
    }
}
