import { DuplicateError } from '@lib/error/DuplicateError';
import mongoose, { Document } from 'mongoose';

export enum Level {
   BEGINNER = 'BEGINNER',
   INTERMEDIATE = 'INTERMEDIATE',
   ADVANCED = 'ADVANCED',
}

export interface Quiz extends Document {
   title: string;
   topics: string[];
   level: Level;
   questions: [
      {
         text: string;
         answerChoices: [
            {
               text: string;
               correct: boolean;
            },
         ];
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
   // removing duplicates at application level in a single document as duplicates in single document are not handled by index but in different document yes https://www.mongodb.com/community/forums/t/unique-indexes-on-embedded-documents/16825 https://jira.mongodb.org/browse/SERVER-1068?focusedCommentId=3195941&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-3195941 https://www.mongodb.com/docs/manual/core/schema-validation/specify-query-expression-rules/#learn-more
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
