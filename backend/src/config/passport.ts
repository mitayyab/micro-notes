import { Strategy as LocalStrategy } from 'passport-local';
import { VerifyFunction } from 'passport-local';
import { PassportStatic } from 'passport';

import { ApiError, Type } from '@lib/error/ApiError';
import { User, UserModel } from '@lib/user/user.model';

const verifyCallback: VerifyFunction = async (email, password, done) => {
   try {
      const user: User = await UserModel.findOne({
         email: email.toLowerCase(),
      });

      if (!user) {
         return done(
            new ApiError(
               Type.UNAUTHORIZED,
               `User with email ${email} not found.`,
            ),
            false,
         );
      }

      if (!user.matchesPassword(password)) {
         return done(
            new ApiError(Type.UNAUTHORIZED, 'Invalid username or password.'),
            false,
         );
      }

      return done(null, user);
   } catch (err) {
      return done(err);
   }
};

export default (passport: PassportStatic) => {
   passport.use(new LocalStrategy(verifyCallback));

   passport.serializeUser((user: User, done) => {
      process.nextTick(() => done(null, user.id));
   });

   passport.deserializeUser(async (id: string, done) => {
      try {
         const user: User = await UserModel.findById(id);
         done(null, user);
      } catch (err) {
         done(err);
      }
   });
};
