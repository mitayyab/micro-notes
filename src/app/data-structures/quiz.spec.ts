import { Quiz, Question, Option } from './quiz';

function testQuestions(): Question[] {
  return [
    new Question("I am question 1, guess?" , [
       new Option("Wrong answer 1", false),
       new Option("Correct answer 1", true), 
    ]),
    new Question("I am question 2, guess?" , [
      new Option("Wrong answer 2", false),
      new Option("Correct answer 2", true), 
   ])
  ]; 
}

describe('Quiz', () => {
  describe('isComplete', () =>{
    it('should return true if all questions are attempted', () => {
      const questions = 
        testQuestions().map((q:Question) => {
          q.attempted = true;

          return q;
        });
      
      expect(new Quiz("Test", questions).isComplete()).toBeTrue();
    });

    it('should return false if any of the questions is not attempted', () => {
      const questions = testQuestions();
      
      expect(new Quiz("Test", questions).isComplete()).toBeFalse();
    });
  });

  describe('attemptedCount', () => {
    it("should return count equal to length of array if all are attempted", () =>{
      const questions = 
        testQuestions().map((q:Question) => {
          q.attempted = true;

          return q;
        });
      
      expect(new Quiz("Test", questions).attemptedCount()).toBe(questions.length);
    });
  });
});
