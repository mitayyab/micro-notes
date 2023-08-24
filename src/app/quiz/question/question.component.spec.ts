import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizzesService } from '../quiz.api.service';
import { QuestionComponent } from './question.component';
import { Quiz, Question, Option } from '../model/quiz';
import { Subscription } from 'rxjs';


describe('QuestionComponent', () => {
    let subscription: Subscription;
    let activatedRoute : ActivatedRoute;
    let router: Router;
    let quizzesService: QuizzesService

    beforeEach(() => {
        subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [QuestionComponent],
        });

        router = TestBed.inject(Router);
        activatedRoute = TestBed.inject(ActivatedRoute);
        quizzesService = TestBed.inject(QuizzesService);
    });

    it('should create the question component', () => {
        const fixture = TestBed.createComponent(QuestionComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize with quiz & question', () => {
            const fixture = TestBed.createComponent(QuestionComponent);
            const component = fixture.componentInstance;
    
            spyOn(activatedRoute.params, 'subscribe').and.callFake((callback : ((params: Object) => void)) => {
                callback({
                    quizID: 0,
                    questionID: 1
                });
    
                return new Subscription();
            });
    
            const question = new Question('Q', []);
            const quiz = new Quiz("Test", 'desc', ['topic'], [question]);
    
            spyOn(quizzesService, 'getQuestion').and.returnValue({
                question: question,
                quiz: quiz
            })
    
            component.ngOnInit();
            expect(component.quiz).toBe(quiz);
            expect(component.question).toBe(question);
            expect(quizzesService.getQuestion).toHaveBeenCalledOnceWith(0, 1);
        });
    });

    describe('ngOnDestroy', () => {
        xit('should unsubscribe upon destroying', () => {
            const fixture = TestBed.createComponent(QuestionComponent);
            const component = fixture.componentInstance;
            component.ngOnInit();
            component.ngOnDestroy();
            expect(subscription.unsubscribe).toHaveBeenCalledWith();
        });
    
    })

    xdescribe('getProgress()', () => {
        it('should return 100 if quiz is completed', () => {
            const fixture = TestBed.createComponent(QuestionComponent);
            const component = fixture.componentInstance;
            const questions : Question[] = [];
            questions.length = 3
            
            component.quiz = new Quiz("Test", 'random',['test'], questions);
            component.quiz.attemptedCount = () => 3;
    
            expect(component.getProgress()).toEqual(100);
    
        });

        it('should return 0 if none of the option is selected', () => {
          const fixture = TestBed.createComponent(QuestionComponent);
          const component = fixture.componentInstance;
          const questions : Question[] = [];
          questions.length = 3
          
          component.quiz = new Quiz("Test", 'random',['test'], questions);
          component.quiz.attemptedCount = () => 0;
  
          expect(component.getProgress()).toEqual(0);
  
        });

        it('should return 75 if 3 of 4 questions in quiz is selected', () => {
            const fixture = TestBed.createComponent(QuestionComponent);
            const component = fixture.componentInstance;
            const questions : Question[] = [];
            questions.length = 4
            
            component.quiz = new Quiz("Test", 'random',['test'], questions);
            component.quiz.attemptedCount = () => 3;
    
            expect(component.getProgress()).toEqual(75);
    
          });
    });

    xdescribe('showNextBtn',()=>{
        it('should return true if we are not on the last question', ()=>{
            const fixture = TestBed.createComponent(QuestionComponent);
            const component = fixture.componentInstance;

            const questions : Question[] = [];
            questions.length = 3
        
            component.quiz = new Quiz("Test", 'random',['test'], questions);

            expect(component.showNextBtn()).toBeTrue();
        });
        
        it('should return false if we are on the last question', ()=>{
            const fixture = TestBed.createComponent(QuestionComponent);
            const component = fixture.componentInstance;

            const questions : Question[] = [];
            questions.length = 0;
        
            component.quiz = new Quiz("Test", 'random',['test'], questions);

            expect(component.showNextBtn()).toBeFalse();
        });
    });

    xdescribe('getNextQuestion',()=>{
        it('should navigate to next question if there is one',()=>{
            const fixture = TestBed.createComponent(QuestionComponent);
            const component = fixture.componentInstance;

            const questions: Question[] = [];
            questions.length = 3;
            component.quiz = new Quiz("Test", 'random',['test'], questions);

            spyOn(router, 'navigate').and.callThrough();

            component.getNextQuestion();

            expect(router.navigate).toHaveBeenCalledWith([
                'quizes',
                0,
                'questions',
                1,
            ]);
        });
    });

    describe('showPrevBtn', ()=>{
        it('should return false if we are not on the first question', ()=>{
            const fixture = TestBed.createComponent(QuestionComponent);
            const component = fixture.componentInstance;

            

            expect();
        });
    });
});
