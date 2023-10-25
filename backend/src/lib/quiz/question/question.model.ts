import { DuplicateError } from '@lib/error/DuplicateError';
import mongoose from 'mongoose';

export interface Question {
   _id?: string;
   text: string;
   answerChoices: [
      {
         text: string;
         correct: boolean;
      },
   ];
}

export const answerChoiceSchema = new mongoose.Schema({
   text: { type: String, required: true },
   correct: { type: Boolean, required: true },
});

export const QuestionSchema = new mongoose.Schema({
   text: { type: String, required: true },
   answerChoices: [answerChoiceSchema],
});

QuestionSchema.pre('save', function () {
   // removing duplicates at application level in a single document as duplicates in single document are not handled by index but in different document yes
   const answerChoices = this.answerChoices;
   const text = this.text;

   let dict = {};

   answerChoices.forEach(answerChoice => {
      if (!dict[answerChoice.text]) dict[answerChoice.text] = true;
      else {
         const Key1 = 'questions.answerChoices.text';
         const Key2 = 'questions.text';
         const keyValue = {
            [Key1]: answerChoice.text,
            [Key2]: text,
         };
         throw new DuplicateError(keyValue);
      }
   });
});

QuestionSchema.index(
   { text: 1, 'answerChoices.text': 1 },
   { unique: true, sparse: true },
);
