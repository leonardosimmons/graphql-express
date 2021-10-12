export type UserAuthToken = {
  id: null | string;
  roles: 'guest' | 'user' | 'admin';
  status: 'not-authorized' | 'authorized';
  permissionLevel: number;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization?: {
    name: string;
  };
  auth: UserAuthToken;
};
