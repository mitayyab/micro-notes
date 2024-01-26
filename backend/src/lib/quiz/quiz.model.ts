import mongoose, { Document } from 'mongoose';

import { DuplicateError } from '@lib/error/DuplicateError';

export enum Level {
   BEGINNER = 'BEGINNER',
   INTERMEDIATE = 'INTERMEDIATE',
   ADVANCED = 'ADVANCED',
}

export interface Question {
   _id?: string;
   text: string;
   answerChoices: {
      text: string;
      correct: boolean;
   }[];
}

export const answerChoiceSchemaDefinition = {
   text: { type: String, required: true },
   correct: { type: Boolean, required: true },
};

export const answerChoiceSchema = new mongoose.Schema(
   answerChoiceSchemaDefinition,
);

export const QuestionSchemaDefinition = {
   text: { type: String, required: true },
   answerChoices: [answerChoiceSchema],
};

export const QuestionSchema = new mongoose.Schema(QuestionSchemaDefinition);

QuestionSchema.pre('save', function () {
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
export interface Quiz extends Document {
   title: string;
   topics: string[];
   level: Level;
   questions: Question[];
}

export const schemaDefinition = {
   title: { type: String, required: true },
   topics: [{ type: String, required: true }],
   level: {
      type: String,
      enum: Level,
      required: true,
   },
   questions: [QuestionSchema],
};

const QuizSchema = new mongoose.Schema(schemaDefinition);

QuizSchema.index(
   { title: 1, 'questions.text': 1 },
   { unique: true, sparse: true },
);

QuizSchema.pre('save', function () {
   const questions = this.questions;
   const title = this.title;

   let dict = {};

   questions.forEach(question => {
      if (!dict[question.text]) dict[question.text] = true;
      else {
         const Key1 = 'questions.text';
         const Key2 = 'title';
         const keyValue = {
            [Key1]: question.text,
            [Key2]: title,
         };
         throw new DuplicateError(keyValue);
      }
   });
});

export const QuizModel = mongoose.model<Quiz>('Quiz', QuizSchema);
