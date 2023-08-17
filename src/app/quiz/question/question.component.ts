import { Component, OnInit } from '@angular/core';
import { Quiz, Question } from '../model/quiz';
import { ActivatedRoute } from '@angular/router';
import { QuizzesService } from '../quiz.api.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit{

  quiz: Quiz | undefined;
  question: Question | undefined;

  constructor(private route: ActivatedRoute, private quizApi: QuizzesService) {}
  
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const quizId = Number(routeParams.get('quizID'));
    const questionId = Number(routeParams.get('questionID'));

  // Find the product that correspond with the id provided in route.
  const {quiz, question} = this.quizApi.getQuestion(quizId, questionId);

  this.quiz = quiz;
  this.question = question;
  

  }

}
