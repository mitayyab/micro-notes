import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User("Ibrahim", "ïbrahimtayyab127@gmail.com")).toBeTruthy();
  });
});
