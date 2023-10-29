import mongoose from 'mongoose';

import {
   Level,
   Quiz,
   // schemaDefinition as quizSchemaDefinition,
} from '@lib/quiz/quiz.model';

// export interface Result extends Document {
//    user: { _id?: string };
//    quiz: { _id?: string };
//    answers: [questionNumber: number, selectedChoice: string];
// }

// export const ResultSchema = new mongoose.Schema ({
//    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
//    answers: [
//       {
//          questionNumber: { type: Number, required: true },
//          selectedChoice: { type: String, required: true },
//       },
//    ],
// });

// ResultSchema.index({ user: 1, quiz: 1 }, { unique: true, sparse: true });

// export const ResultModel = mongoose.model<Result>('Result', ResultSchema);

export interface Result extends Document {
   user: { _id?: string };
   quiz: Quiz;
}

// const resultSchemaDefinition = {
//    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//    quiz: quizSchemaDefinition,

// };

const resultSchemaDefinition = {
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   quiz: {
      title: { type: String, required: true },
      topics: [{ type: String, required: true }],
      level: {
         type: String,
         enum: Level,
         required: true,
      },
      questions: [
         {
            text: { type: String, required: true },
            answerChoices: [
               {
                  text: { type: String, required: true },
                  correct: { type: Boolean, required: true },
                  selected: { type: Boolean, required: true },
               },
            ],
         },
      ],
   },
};

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
