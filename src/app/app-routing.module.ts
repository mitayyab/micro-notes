import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './quiz/list/list.component';
import { QuestionComponent } from './quiz/question/question.component';


const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'question',
    component: QuestionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
