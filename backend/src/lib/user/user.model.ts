import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface User extends Document {
   firstName: string;
   lastName: string;
   email: string;
   password?: string;
   _password?: string;
   hashed_password: string;
   isAdmin: boolean;
   matchesPassword: (password: string) => boolean;
   toDTO: () => DTO;
}

export type DTO = {
   id: string;
   email: string;
   firstName: string;
   lastName: string;
};

const UserSchema = new Schema<User>({
   firstName: { type: String, required: true },
   lastName: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   hashed_password: { type: String, required: true },
   isAdmin: { type: Boolean, required: true },
});

UserSchema.virtual('password')
   .set(function (password: string) {
      this._password = password;
      this.hashed_password = bcrypt.hashSync(password, 10);
   })
   .get(function () {
      return this._password;
   });

UserSchema.methods.matchesPassword = function (password: string): boolean {
   return bcrypt.compareSync(password, this.hashed_password);
};

UserSchema.methods.toDTO = function () {
   return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
   };
};

export const UserModel: Model<User> = mongoose.model('User', UserSchema);
