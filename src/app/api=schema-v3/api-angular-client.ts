import { InjectionToken } from '@angular/core';
import { DELETE, GET, POST, PUT } from './http-client-utils';

export const UsersApi = new InjectionToken('USERS_API', {
  providedIn: 'root',
  factory: () => {
    return {
      getUsers: GET<UsersParams>('/api/users', { mapTo: User, valueOnError: [] })<User[]>,
      getUserById: GET('/api/users/:id', { mapTo: User, valueOnError: null })<User>,
      createUser: POST<UserBody>('/api/users', { mapTo: User, valueOnError: null })<User>,
      updateUser: PUT<UserBody>('/api/users/:id', { mapTo: User, valueOnError: null })<User>,
      deleteUser: DELETE('/api/users/:id')
    };
  }
});

export class User {
  name: string;
  email: string;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}

export type UsersParams = {
  page?: number,
  limit?: number,
  orderBy?: string,
  sort?: 'asc' | 'desc',
};

export type UserBody = {
  name: string,
  email: string,
};
