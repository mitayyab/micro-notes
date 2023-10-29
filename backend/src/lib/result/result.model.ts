import mongoose from 'mongoose';

import {
   QuestionSchemaDefinition,
   // Level,
   Quiz,
   answerChoiceSchemaDefinition,
   schemaDefinition as quizSchemaDefinition,
} from '@lib/quiz/quiz.model';

export interface attemptedQuestion {
   _id?: string;
   text: string;
   answerChoices: [
      {
         text: string;
         correct: boolean;
         selected: boolean;
      },
   ];
}

export interface attemptedQuiz extends Omit<Quiz, 'questions'> {
   questions: [attemptedQuestion];
}

export interface Result extends Document {
   user: { _id?: string };
   quiz: attemptedQuiz;
}

// const resultSchemaDefinition = {
//    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//    quiz: {
//       title: { type: String, required: true },
//       topics: [{ type: String, required: true }],
//       level: {
//          type: String,
//          enum: Level,
//          required: true,
//       },
//       questions: [
//          {
//             text: { type: String, required: true },
//             answerChoices: [
//                {
//                   text: { type: String, required: true },
//                   correct: { type: Boolean, required: true },
//                   selected: { type: Boolean, required: true },
//                },
//             ],
//          },
//       ],
//    },
// };

// -------------------------------------------------------------------------

// const resultSchemaDefinition = {
//    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//    quiz: quizSchemaDefinition,
// };

// resultSchemaDefinition.quiz.questions = [
//    Object.assign(
//       QuestionSchemaDefinition,
//    ),
// ];

// resultSchemaDefinition.quiz.questions[0].answerChoices = [
//    Object.assign(
//       {
//          selected: { type: Boolean, required: true },
//       },
//       resultSchemaDefinition.quiz.questions[0].answerChoices[0],
//    ),
// ];

// -----------------------------------------------------------------------------
// move from small to big and use object.assign 

export const attemptedAnswerChoicesSchema = Object.assign(
   {
      selected: { type: Boolean, required: true },
   },
   answerChoiceSchemaDefinition,
);

export let attemptedQuestionSchema = Object.assign(QuestionSchemaDefinition);
attemptedQuestionSchema.answerChoices = Object.assign(
   [],
   [attemptedAnswerChoicesSchema],
);

export let attemptedQuizSchema = Object.assign(quizSchemaDefinition);
attemptedQuizSchema.questions = Object.assign([], [attemptedQuestionSchema]);

export const resultSchemaDefinition = {
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   quiz: attemptedQuizSchema,
};

// ------------------------------------------------------------------------------

// const resultSchemaDefinition = {
//    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//    quiz: quizSchemaDefinition,
// };

// resultSchemaDefinition.quiz.questions = [
//    Object.assign(QuestionSchemaDefinition),
// ];

// resultSchemaDefinition.quiz.questions[0].answerChoices = [
//    Object.assign(
//       {
//          selected: { type: Boolean, required: true },
//       },
//       resultSchemaDefinition.quiz.questions[0].answerChoices[0],
//    ),
// ];

export const ResultSchema = new mongoose.Schema(resultSchemaDefinition);

ResultSchema.index(
   { user: 1, 'quiz.title': 1 },
   { unique: true, sparse: true },
);

export const ResultModel = mongoose.model<Result>('Result', ResultSchema);
