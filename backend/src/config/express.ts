import path from 'path';
import passport from 'passport';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { router as fileBasedRouter } from 'express-file-routing';
import { fileURLToPath } from 'url';
import { Application } from 'express';

import configurePassport from '@config/passport';
import { SESSION_SECRET } from '@config/env';
import {
   apiErrorHandler,
   mongoDatabaseErrorHandler,
} from '@lib/error/error.middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.join(__dirname, '../api');

export default async (app: Application) => {
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: true }));
   app.use(cookieParser());
   app.use(
      session({
         secret: SESSION_SECRET,
         resave: false,
         saveUninitialized: false,
      })
   );

   configurePassport(passport);
   app.use(passport.initialize());
   app.use(passport.session());

   app.use('/', await fileBasedRouter({ directory: routesDir }));

   app.use(mongoDatabaseErrorHandler);
   app.use(apiErrorHandler);
};
