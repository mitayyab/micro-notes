import { Quiz, Question, AnswerChoice, AnswerState } from './quiz';

function testQuestions(): Question[] {
   return [
      new Question('I am question 1, guess?', [
         new AnswerChoice('Wrong answer 1', false),
         new AnswerChoice('Correct answer 1', true),
      ]),
      new Question('I am question 2, guess?', [
         new AnswerChoice('Wrong answer 2', false),
         new AnswerChoice('Correct answer 2', true),
      ]),
      new Question('I am question 3, guess?', [
         new AnswerChoice('Correct answer 3', true),
         new AnswerChoice('Wrong answer 3', false),
      ]),
   ];
}

function getTestQuestion(): Question {
   return new Question('I am question 1, guess?', [
      new AnswerChoice('Wrong answer 1', false),
      new AnswerChoice('Correct answer 1', true),
   ]);
}

describe('quiz', () => {
   describe('AnswerChoice', () => {
      describe('getState()', () => {
         it('should return not chosen if it is not selected & answer is wrong', () => {
            const answerChoice = new AnswerChoice('Wrong answer', false);

            expect(answerChoice.getState()).toEqual(AnswerState.NotChosen);
         });

         it('should return not chosen if it is not selected but answer is correct', () => {
            const answerChoice = new AnswerChoice('Wrong answer', true);

            expect(answerChoice.getState()).toEqual(AnswerState.NotChosen);
         });

         it('should return incorrect if it the incorrect answer was selected', () => {
            const answerChoice = new AnswerChoice('Wrong answer', false);
            answerChoice.selected = true;

            expect(answerChoice.getState()).toEqual(AnswerState.InCorrect);
         });

         it('should return correct if it the correct answer was selected', () => {
            const answerChoice = new AnswerChoice('Correct answer', true);
            answerChoice.selected = true;

            expect(answerChoice.getState()).toEqual(AnswerState.Correct);
         });
      });
   });

   describe('Question', () => {
      describe('isAttempted()', () => {
         it('should return false if none of the options is attempted', () => {
            const question = getTestQuestion();

            expect(question.isAttempted()).toEqual(false);
         });

         it('should return true if any of the options is selected', () => {
            const question = getTestQuestion();
            question.answerChoices[0].selected = true;

            expect(question.isAttempted()).toEqual(true);
         });

         it('should return true if more than 1 options are selected', () => {
            const question = getTestQuestion();
            question.answerChoices[0].selected = true;
            question.answerChoices[1].selected = true;

            expect(question.isAttempted()).toEqual(true);
         });
      });

      describe('isCorrectlyAnswered()', () => {
         it('should return false if both the correct and incorrect answers are selected', () => {
            const question = getTestQuestion();
            question.answerChoices[0].selected = true;
            question.answerChoices[1].selected = true;

            expect(question.isCorrectlyAnswered()).toEqual(false);
         });

         it('should return false if incorrect answers selected', () => {
            const question = getTestQuestion();
            question.answerChoices[0].selected = true;

            expect(question.isCorrectlyAnswered()).toEqual(false);
         });

         it('should return true if correct answers selected', () => {
            const question = getTestQuestion();
            question.answerChoices[1].selected = true;

            expect(question.isCorrectlyAnswered()).toEqual(true);
         });
      });
   });

   describe('Quiz', () => {
      describe('isComplete()', () => {
         it('should return true if all questions are attempted', () => {
            const questions = testQuestions().map((q: Question) => {
               q.answerChoices[0].selected = true;

               return q;
            });

            expect(
               new Quiz('Test', 'random', ['test'], questions).isComplete(),
            ).toBeTrue();
         });

         it('should return false if all of the questions are not attempted', () => {
            const questions = testQuestions();

            expect(
               new Quiz('Test', 'random', ['test'], questions).isComplete(),
            ).toBeFalse();
         });

         it('should return false if any of the questions is not attempted', () => {
            const questions = testQuestions();
            questions[0].answerChoices[0].selected = true;

            expect(
               new Quiz('Test', 'random', ['test'], questions).isComplete(),
            ).toBeFalse();
         });
      });

      describe('getAttemptedCount()', () => {
         it('should return 1 if only one question is attempted', () => {
            const questions = testQuestions();
            questions[1].answerChoices[0].selected = true;

            expect(
               new Quiz(
                  'Test',
                  'random',
                  ['test'],
                  questions,
               ).getAttemptedCount(),
            ).toBe(1);
         });

         it('should return count equal to length of array if all are attempted', () => {
            const questions = testQuestions().map((q: Question) => {
               q.answerChoices[0].selected = true;
               return q;
            });

            expect(
               new Quiz(
                  'Test',
                  'random',
                  ['test'],
                  questions,
               ).getAttemptedCount(),
            ).toBe(questions.length);
         });
      });

      describe('getCorrectlyAnsweredCount()', () => {
         it('should return 0 if none of the questions are answered correctly', () => {
            const questions = testQuestions()
               .map((q: Question) => {
                  q.answerChoices[0].selected = true;
                  return q;
               })
               .filter((q: Question) => {
                  return (
                     q.answerChoices[0].correct == false &&
                     q.answerChoices[0].selected == true
                  );
               });

            expect(
               new Quiz(
                  'Test',
                  'random',
                  ['test'],
                  questions,
               ).getCorrectlyAnsweredCount(),
            ).toBe(0);
         });

         it('should return count equal to total length if all of the questions are answered correctly', () => {
            const questions = testQuestions()
               .map((q: Question) => {
                  q.answerChoices[1].selected = true;
                  return q;
               })
               .filter((q: Question) => {
                  return q.answerChoices[1].correct == true;
               });

            expect(
               new Quiz(
                  'Test',
                  'random',
                  ['test'],
                  questions,
               ).getCorrectlyAnsweredCount(),
            ).toBe(2);
         });

         it('should return count of questions that are answered correctly', () => {
            const questions = testQuestions().map((q: Question) => {
               q.answerChoices[0].selected = true;
               return q;
            });
            expect(
               new Quiz(
                  'Test',
                  'random',
                  ['test'],
                  questions,
               ).getCorrectlyAnsweredCount(),
            ).toBe(1);
         });
      });
   });
});
