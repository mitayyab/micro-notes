import { Quiz, Question, Option, AnswerState } from './quiz';

function testQuestions(): Question[] {
  return [
    new Question("I am question 1, guess?" , [
       new Option("Wrong answer 1", false),
       new Option("Correct answer 1", true), 
    ]),
    new Question("I am question 2, guess?" , [
      new Option("Wrong answer 2", false),
      new Option("Correct answer 2", true), 
   ]),
   new Question("I am question 3, guess?" , [
    new Option("Correct answer 3", true),
    new Option("Wrong answer 3", false), 
 ])
  ]; 
}

function getTestQuestion(): Question{

  return new Question("I am question 1, guess?" , [
              new Option("Wrong answer 1", false),
              new Option("Correct answer 1", true), 
            ]);
}

describe('Option', () => {

  describe('getState', () =>{
    it('should return not chosen if it is not selected', () => {
      
      const option =  new Option("Wrong answer", false); 

      expect(option.getState()).toEqual(AnswerState.NotChosen);
    });

    it('should return incorrect if it the incorrect answer was selected', () => {
      
      const option =  new Option("Wrong answer", false); 
      option.selected = true;

      expect(option.getState()).toEqual(AnswerState.InCorrect);
    });

    it('should return correct if it the correct answer was selected', () => {
      
      const option =  new Option("Correct answer", true); 
      option.selected = true;

      expect(option.getState()).toEqual(AnswerState.Correct);
    });

  });

});

describe('Question',()=>{
  
  describe('correctOptionCount',()=>{
    it('should return false if none of the options is attempted', ()=> {
      const question = getTestQuestion();

      expect(question.isAttempted()).toEqual(false);
    });

    it('should return true if any of the options is selected', ()=> {
      const question = getTestQuestion();
      question.options[0].selected = true;

      expect(question.isAttempted()).toEqual(true);
    });

    it('should return true if more than 1 options are selected', ()=> {
      const question = getTestQuestion();
      question.options[0].selected = true;
      question.options[1].selected = true;

      expect(question.isAttempted()).toEqual(true);
    });
  });



  describe('isCorrectlyAnswered',()=>{
    it('should return false if both the correct answers and incorrect selected', ()=> {
      const question = getTestQuestion();
      question.options[0].selected = true;
      question.options[1].selected = true;

      expect(question.isCorrectlyAnswered()).toEqual(false);
    });

    it('should return false if incorrect answers selected', ()=> {
      const question = getTestQuestion();
      question.options[0].selected = true;

      expect(question.isCorrectlyAnswered()).toEqual(false);
    });

    it('should return true if correct answers selected', ()=> {
      const question = getTestQuestion();
      question.options[1].selected = true;

      expect(question.isCorrectlyAnswered()).toEqual(true);
    });

  });

});

describe('Quiz', () => {
  describe('isComplete', () =>{
    it('should return true if all questions are attempted', () => {
      const questions = 
        testQuestions().map((q:Question) => {
          q.options[0].selected = true;

          return q;
        });
      
      expect(new Quiz("Test", 'random',['test'], questions).isComplete()).toBeTrue();
    });

    it('should return false if any of the questions is not attempted', () => {
      const questions = testQuestions();
      
      expect(new Quiz("Test", 'random',['test'], questions).isComplete()).toBeFalse();
    });
  });

  describe('attemptedCount', () => {
    it("should return count equal to length of array if all are attempted", () =>{
      const questions = 
        testQuestions().map((q:Question) => {
          q.options[0].selected = true;
          return q;
        });
      
      expect(new Quiz("Test", 'random',['test'], questions).attemptedCount()).toBe(questions.length);
    });
  });

  describe('correctAnsweredCount', ()=>{
    it('should return 0 if none of the questions are answered correctly', ()=>{
      const questions = testQuestions().map((q:Question)=> {
        q.options[0].selected = true
        return q;
      }).filter((q:Question)=>{
        return q.options[0].correct == false && q.options[0].selected == true;
      });

      expect(new Quiz("Test", 'random',['test'], questions).correctAnsweredCount()).toBe(0);
    })

    it('should return count equal to total length if all of the questions are answered correctly', ()=>{
      const questions = testQuestions().map((q:Question)=> {
        q.options[1].selected = true
        return q;
      }).filter((q:Question)=>{
        return q.options[1].correct == true;
      });

      expect(new Quiz("Test", 'random',['test'], questions).correctAnsweredCount()).toBe(2);
    })

    it('should return count of questions that are answered correctly', ()=>{
      const questions = testQuestions().map((q:Question)=> {
        q.options[0].selected = true
        return q;
      });
      expect(new Quiz("Test", 'random',['test'], questions).correctAnsweredCount()).toBe(1);
    })

  });
});
