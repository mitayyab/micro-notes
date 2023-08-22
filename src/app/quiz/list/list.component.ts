import { Component } from '@angular/core';
import { Quiz } from '../model/quiz';
import { QuizzesService } from '../quiz.api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  quizes: Quiz[];

  constructor(private quizApi: QuizzesService, private router: Router) {
    this.quizes = quizApi.getQuizes();
  }

  startQuiz(quizId: number)
  {
    this.router.navigate(['quizes', quizId, 'questions', 0])
  }
}
