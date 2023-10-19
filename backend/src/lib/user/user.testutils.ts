import { User, UserModel } from './user.model';

export const deleteUser = async (email: string): Promise<boolean> => {
   const criteria = { email: email };

   if (await UserModel.findOne(criteria)) {
      await UserModel.deleteOne(criteria);

      return true;
   }
   return false;
};

export const createUser = async (user: Record<string, any>): Promise<User> => {
   return await UserModel.create(user);
};
