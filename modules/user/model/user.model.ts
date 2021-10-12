import { User } from '.prisma/client';

interface UserModelInterface {}

class UserModel implements UserModelInterface {
  private _current: User = {} as User;

  constructor(user?: User) {
    this._current = user || ({} as User);
  }

  get() {
    return this._current;
  }

  set(user: User) {
    this._current = user;
  }

  public filterUserInfo(user?: User): Partial<User> {
    const { password, status, permissionLevel, ...rest } =
      user || this._current;
    return rest;
  }
}

export { UserModel };
