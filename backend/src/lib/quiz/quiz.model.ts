import mongoose, { Document } from 'mongoose';

import { DuplicateError } from '@lib/error/DuplicateError';
import { QuestionSchema } from './question/question.model';
import { Question } from './question/question.model';

export enum Level {
   BEGINNER = 'BEGINNER',
   INTERMEDIATE = 'INTERMEDIATE',
   ADVANCED = 'ADVANCED',
}
export interface Quiz extends Document {
   title: string;
   topics: string[];
   level: Level;
   questions: [Question];
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
